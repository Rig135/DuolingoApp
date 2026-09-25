from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas import CheckAnswerRequest, CheckAnswerResponse
from app.services.user_service import get_current_user
from app.services.lesson_service import check_exercise_answer

router = APIRouter()

@router.post("/{exercise_id}/check", response_model=CheckAnswerResponse)
def check_answer(
    exercise_id: int,
    payload: CheckAnswerRequest,
    db: Session = Depends(get_db)
):
    """Authoritatively validate an exercise answer and deduct heart if wrong."""
    user = get_current_user(db)
    return check_exercise_answer(db, exercise_id, user, payload.user_answer)
