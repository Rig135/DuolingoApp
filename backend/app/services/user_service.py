from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from app.models import User, DailyActivity

DEFAULT_USERNAME = "default_learner"

def get_current_user(db: Session) -> User:
    """Fetch the default learner or create one if missing."""
    user = db.query(User).filter(User.username == DEFAULT_USERNAME).first()
    now = datetime.now(timezone.utc)
    
    if not user:
        user = User(username=DEFAULT_USERNAME, xp=0, streak=0, hearts=5, gems=500, last_active_date=now, last_heart_refill=now)
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
        
    changed = False

    # Streak reset logic
    today_str = now.strftime("%Y-%m-%d")
    yesterday_str = (now - timedelta(days=1)).strftime("%Y-%m-%d")
    last_active_str = user.last_active_date.strftime("%Y-%m-%d") if user.last_active_date else None
    
    if last_active_str and last_active_str != today_str and last_active_str != yesterday_str and user.streak > 0:
        user.streak = 0
        changed = True

    # Heart regeneration (1 heart every 1 minute for testing purposes, typically 4 hours)
    if user.hearts < 5 and user.last_heart_refill:
        last_refill = user.last_heart_refill.replace(tzinfo=timezone.utc) if user.last_heart_refill.tzinfo is None else user.last_heart_refill
        elapsed = (now - last_refill).total_seconds()
        hearts_to_add = int(elapsed // 60) # 1 heart per 60 seconds
        if hearts_to_add > 0:
            user.hearts = min(5, user.hearts + hearts_to_add)
            user.last_heart_refill = last_refill + timedelta(seconds=hearts_to_add * 60)
            changed = True
            
    # Always keep last_heart_refill updated if hearts are full
    if user.hearts == 5 and user.last_heart_refill:
        last_refill = user.last_heart_refill.replace(tzinfo=timezone.utc) if user.last_heart_refill.tzinfo is None else user.last_heart_refill
        elapsed_since_full = (now - last_refill).total_seconds()
        if elapsed_since_full > 60:
            user.last_heart_refill = now
            changed = True

    if changed:
        db.commit()
        db.refresh(user)

    return user

def refill_user_hearts(db: Session, user: User) -> int:
    """Refill user hearts back to maximum 5."""
    if user.gems >= 100:
        user.gems -= 100
        user.hearts = 5
        user.last_heart_refill = datetime.now(timezone.utc)
        db.commit()
        db.refresh(user)
    return user.hearts

def update_streak_and_xp(db: Session, user: User, xp_awarded: int) -> int:
    """
    Deterministic streak & daily XP updates:
    - If user already practiced today: streak remains same.
    - If user practiced yesterday: streak increases by 1.
    - If user was inactive > 1 day: streak resets to 1.
    - Tracks XP into DailyActivity for today's date (YYYY-MM-DD).
    """
    now = datetime.now(timezone.utc)
    today_str = now.strftime("%Y-%m-%d")
    yesterday_str = (now - timedelta(days=1)).strftime("%Y-%m-%d")
    
    last_active_str = user.last_active_date.strftime("%Y-%m-%d") if user.last_active_date else None

    if xp_awarded > 0:
        if last_active_str == today_str:
            # Already active today, streak doesn't change
            pass
        elif last_active_str == yesterday_str:
            # Active yesterday, increment streak
            user.streak = (user.streak or 0) + 1
        else:
            # Gap in activity, reset streak
            user.streak = 1

        user.xp = (user.xp or 0) + xp_awarded
        user.last_active_date = now

        # Update DailyActivity
        activity = db.query(DailyActivity).filter(
            DailyActivity.user_id == user.id,
            DailyActivity.date == today_str
        ).first()

        if activity:
            activity.xp_earned += xp_awarded
        else:
            activity = DailyActivity(user_id=user.id, date=today_str, xp_earned=xp_awarded)
            db.add(activity)

        db.commit()
        db.refresh(user)

    return user.streak
