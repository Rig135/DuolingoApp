from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas import RefillHeartsResponse, ProfileResponse, LeaderboardResponse
from app.services.user_service import get_current_user, refill_user_hearts
from app.services.stats_service import get_user_profile, get_leaderboard_data

router = APIRouter()

# Exact requested path: POST /api/users/me/refill-hearts
@router.post("/users/me/refill-hearts", response_model=RefillHeartsResponse, tags=["users"])
def refill_hearts(db: Session = Depends(get_db)):
    """Refill hearts back to maximum 5."""
    user = get_current_user(db)
    hearts = refill_user_hearts(db, user)
    return RefillHeartsResponse(hearts=hearts, message="Hearts refilled to 5")

# Exact requested path: GET /api/profile
@router.get("/profile", response_model=ProfileResponse, tags=["profile"])
def get_profile(db: Session = Depends(get_db)):
    """Fetch profile stats, streak, and daily history."""
    user = get_current_user(db)
    return get_user_profile(db, user)

# Exact requested path: GET /api/leaderboard
@router.get("/leaderboard", response_model=LeaderboardResponse, tags=["leaderboard"])
def get_leaderboard(db: Session = Depends(get_db)):
    """Fetch ranked leaderboard standings."""
    user = get_current_user(db)
    return get_leaderboard_data(db, user)
