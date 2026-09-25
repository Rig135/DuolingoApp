from typing import Dict, Any, List
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models import User, Unit, Skill, Lesson, Exercise, UserProgress
from app.schemas import DashboardResponse, UserSummary, UnitSummary, SkillSummary, LessonDetail, ExercisePublic

def get_dashboard_data(db: Session, user: User) -> DashboardResponse:
    """Fetch units and skills with user progress and lock/unlock status overlaid."""
    # Build dictionary of user's progress per skill
    progress_rows = db.query(UserProgress).filter(UserProgress.user_id == user.id).all()
    user_prog_map = {p.skill_id: p for p in progress_rows}

    units = db.query(Unit).order_by(Unit.order).all()
    unit_summaries: List[UnitSummary] = []

    for unit in units:
        skill_summaries: List[SkillSummary] = []
        for skill in unit.skills:
            prog = user_prog_map.get(skill.id)
            # Default first skill of first unit to unlocked if no record
            is_unlocked = prog.is_unlocked if prog else (unit.order == 1 and skill.order == 1)
            completed = prog.completed_lessons if prog else 0
            total_lessons = len(skill.lessons)
            next_lesson_id = None
            if skill.lessons:
                sorted_lessons = sorted(skill.lessons, key=lambda l: l.order)
                if completed < total_lessons:
                    next_lesson_id = sorted_lessons[completed].id
                else:
                    next_lesson_id = sorted_lessons[0].id

            skill_summaries.append(SkillSummary(
                id=skill.id,
                unit_id=skill.unit_id,
                title=skill.title,
                order=skill.order,
                is_unlocked=is_unlocked,
                completed_lessons=completed,
                total_lessons=total_lessons,
                next_lesson_id=next_lesson_id
            ))

        unit_summaries.append(UnitSummary(
            id=unit.id,
            title=unit.title,
            description=unit.description,
            order=unit.order,
            skills=skill_summaries
        ))

    return DashboardResponse(
        user=UserSummary.model_validate(user),
        units=unit_summaries
    )

def get_lesson_for_player(db: Session, lesson_id: int, user: User) -> LessonDetail:
    """
    Fetch lesson exercises for the player.
    Crucial security rule: strips correct_answer from all exercise objects.
    Enforces Rule 9: Rejects if the parent skill is locked.
    """
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    skill = lesson.skill
    prog = db.query(UserProgress).filter(
        UserProgress.user_id == user.id,
        UserProgress.skill_id == skill.id
    ).first()

    is_unlocked = prog.is_unlocked if prog else (skill.unit.order == 1 and skill.order == 1)
    if not is_unlocked:
        raise HTTPException(status_code=403, detail="Skill is locked. Complete previous skills first.")

    exercises_public = [
        ExercisePublic(
            id=ex.id,
            lesson_id=ex.lesson_id,
            type=ex.type,
            question=ex.question,
            options=ex.options,
            order=ex.order
        )
        for ex in lesson.exercises
    ]

    return LessonDetail(
        id=lesson.id,
        skill_id=lesson.skill_id,
        order=lesson.order,
        exercises=exercises_public
    )
