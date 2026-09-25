from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas import LessonDetail, CompleteLessonResponse
from app.services.user_service import get_current_user
from app.services.course_service import get_lesson_for_player
from app.services.lesson_service import complete_lesson

router = APIRouter()

@router.get("/{lesson_id}", response_model=LessonDetail)
def get_lesson(lesson_id: int, db: Session = Depends(get_db)):
    """Fetch lesson exercises without exposing answer keys."""
    user = get_current_user(db)
    return get_lesson_for_player(db, lesson_id, user)

@router.post("/{lesson_id}/complete", response_model=CompleteLessonResponse)
def finish_lesson(lesson_id: int, db: Session = Depends(get_db)):
    """Authoritatively record lesson completion, XP, and unlock next steps."""
    user = get_current_user(db)
    return complete_lesson(db, lesson_id, user)
