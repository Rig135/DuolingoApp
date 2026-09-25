from typing import Any, Dict, List
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models import User, Exercise, Lesson, Skill, UserProgress, LessonCompletion
from app.schemas import CheckAnswerResponse, CompleteLessonResponse
from app.services.user_service import update_streak_and_xp

def normalize_text(text: Any) -> str:
    """Helper to clean string input for robust answer checking."""
    if text is None:
        return ""
    return str(text).strip().lower()

def evaluate_answer(exercise: Exercise, user_answer: Any) -> bool:
    """
    Authoritative answer validation logic for all 5 Duolingo exercise types:
    - MULTIPLE_CHOICE: Single selected option matches correct_answer
    - TRANSLATE: Ordered word tokens match correct token sequence
    - TYPE_ANSWER: Direct case/space-normalized comparison
    - MATCH_PAIRS: Match all given key-value pairs
    - FILL_BLANK: Selected token matches blank answer
    """
    ex_type = exercise.type
    correct = exercise.correct_answer

    if ex_type in ["MULTIPLE_CHOICE", "TYPE_ANSWER", "FILL_BLANK"]:
        return normalize_text(user_answer) == normalize_text(correct)

    elif ex_type == "TRANSLATE":
        # Can be list of words or single sentence string
        if isinstance(user_answer, list) and isinstance(correct, list):
            return [normalize_text(w) for w in user_answer] == [normalize_text(w) for w in correct]
        elif isinstance(user_answer, str) and isinstance(correct, list):
            return normalize_text(user_answer) == normalize_text(" ".join(correct))
        elif isinstance(user_answer, list) and isinstance(correct, str):
            return normalize_text(" ".join(user_answer)) == normalize_text(correct)
        else:
            return normalize_text(user_answer) == normalize_text(correct)

    elif ex_type == "MATCH_PAIRS":
        # Both user_answer and correct are list of dicts: [{"en": "Hello", "es": "Hola"}, ...]
        if isinstance(user_answer, list) and isinstance(correct, list):
            def pair_set(lst):
                return {f"{normalize_text(p.get('en', ''))}:{normalize_text(p.get('es', ''))}" for p in lst if isinstance(p, dict)}
            return pair_set(user_answer) == pair_set(correct)
        return False

    return False

def check_exercise_answer(db: Session, exercise_id: int, user: User, user_answer: Any) -> CheckAnswerResponse:
    """
    Authoritative exercise validation endpoint handler.
    Deducts 1 heart on incorrect answers; hearts cannot drop below 0.
    """
    exercise = db.query(Exercise).filter(Exercise.id == exercise_id).first()
    if not exercise:
        raise HTTPException(status_code=404, detail="Exercise not found")

    if (user.hearts or 0) <= 0:
        raise HTTPException(status_code=400, detail="Out of hearts. Refill hearts to continue.")

    is_correct = evaluate_answer(exercise, user_answer)

    if is_correct:
        message = "Nicely done! Correct answer."
    else:
        # Deduct 1 heart on wrong answer (Rule 4 & 5)
        user.hearts = max(0, (user.hearts or 5) - 1)
        db.commit()
        db.refresh(user)
        message = "Incorrect answer."

    return CheckAnswerResponse(
        is_correct=is_correct,
        hearts_remaining=user.hearts,
        correct_answer=exercise.correct_answer,
        message=message
    )

def complete_lesson(db: Session, lesson_id: int, user: User) -> CompleteLessonResponse:
    """
    Authoritatively completes a lesson.
    Enforces rules:
    - Rejects if user has 0 hearts (lesson failed)
    - Rejects if skill is locked
    - Prevents duplicate XP rewards via LessonCompletion tracking
    - Increments skill progress
    - Unlocks next skill if skill completed
    - Updates streak and daily activity
    """
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    if (user.hearts or 0) <= 0:
        raise HTTPException(status_code=400, detail="Cannot complete lesson with 0 hearts.")

    skill = lesson.skill
    prog = db.query(UserProgress).filter(
        UserProgress.user_id == user.id,
        UserProgress.skill_id == skill.id
    ).first()

    is_unlocked = prog.is_unlocked if prog else (skill.unit.order == 1 and skill.order == 1)
    if not is_unlocked:
        raise HTTPException(status_code=403, detail="Cannot complete a lesson in a locked skill.")

    if not prog:
        prog = UserProgress(user_id=user.id, skill_id=skill.id, is_unlocked=True, completed_lessons=0)
        db.add(prog)
        db.flush()

    # Rule 7: Prevent duplicate XP reward
    existing_completion = db.query(LessonCompletion).filter(
        LessonCompletion.user_id == user.id,
        LessonCompletion.lesson_id == lesson.id
    ).first()

    first_time = existing_completion is None
    xp_awarded = 15 if first_time else 0

    if first_time:
        completion = LessonCompletion(user_id=user.id, lesson_id=lesson.id)
        db.add(completion)
        prog.completed_lessons = (prog.completed_lessons or 0) + 1

    # Check if skill completed
    total_skill_lessons = len(skill.lessons)
    skill_completed = (prog.completed_lessons >= total_skill_lessons)
    next_skill_unlocked = False

    # Unlock next skill if this skill has been completed
    if skill_completed:
        # Find next skill in order
        next_skill = db.query(Skill).filter(
            Skill.unit_id == skill.unit_id,
            Skill.order > skill.order
        ).order_by(Skill.order).first()

        # If no more skills in current unit, find first skill of next unit
        if not next_skill:
            next_unit = db.query(Skill).join(Skill.unit).filter(
                Skill.unit.has(order=skill.unit.order + 1)
            ).order_by(Skill.order).first()
            if next_unit:
                next_skill = next_unit

        if next_skill:
            next_prog = db.query(UserProgress).filter(
                UserProgress.user_id == user.id,
                UserProgress.skill_id == next_skill.id
            ).first()
            if not next_prog:
                next_prog = UserProgress(user_id=user.id, skill_id=next_skill.id, is_unlocked=True, completed_lessons=0)
                db.add(next_prog)
            else:
                next_prog.is_unlocked = True
            next_skill_unlocked = True

    # Update streak & XP (Rule 1, 6, 10, 11)
    new_streak = update_streak_and_xp(db, user, xp_awarded)

    db.commit()
    db.refresh(user)

    message = f"Lesson completed! Earned {xp_awarded} XP." if xp_awarded > 0 else "Lesson practiced again! No duplicate XP."

    return CompleteLessonResponse(
        success=True,
        xp_awarded=xp_awarded,
        total_xp=user.xp,
        streak=new_streak,
        skill_completed=skill_completed,
        next_skill_unlocked=next_skill_unlocked,
        message=message
    )
