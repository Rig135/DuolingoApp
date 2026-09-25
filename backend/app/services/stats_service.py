from typing import List
from sqlalchemy.orm import Session
from app.models import User, LessonCompletion, DailyActivity
from app.schemas import ProfileResponse, UserSummary, DailyActivityItem, LeaderboardResponse, LeaderboardEntry

def get_user_profile(db: Session, user: User) -> ProfileResponse:
    """Fetch profile summary, total completed lessons, and daily XP activity."""
    total_completed = db.query(LessonCompletion).filter(LessonCompletion.user_id == user.id).count()

    activities = db.query(DailyActivity).filter(
        DailyActivity.user_id == user.id
    ).order_by(DailyActivity.date.desc()).limit(14).all()

    daily_history = [
        DailyActivityItem(date=act.date, xp_earned=act.xp_earned)
        for act in activities
    ]

    return ProfileResponse(
        user=UserSummary.model_validate(user),
        total_lessons_completed=total_completed,
        daily_history=daily_history
    )

def get_leaderboard_data(db: Session, current_user: User) -> LeaderboardResponse:
    """Fetch ranked leaderboard entries sorted by XP descending."""
    users = db.query(User).order_by(User.xp.desc()).limit(20).all()
    entries: List[LeaderboardEntry] = []

    for rank, u in enumerate(users, start=1):
        entries.append(LeaderboardEntry(
            rank=rank,
            username=u.username,
            xp=u.xp or 0,
            streak=u.streak or 0,
            is_current_user=(u.id == current_user.id)
        ))

    return LeaderboardResponse(entries=entries)
