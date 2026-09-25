from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas import DashboardResponse
from app.services.user_service import get_current_user
from app.services.course_service import get_dashboard_data

router = APIRouter()

@router.get("/dashboard", response_model=DashboardResponse)
def get_dashboard(db: Session = Depends(get_db)):
    """Fetch curriculum path and user progress."""
    user = get_current_user(db)
    return get_dashboard_data(db, user)
