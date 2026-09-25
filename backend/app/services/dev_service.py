from sqlalchemy.orm import Session
from app.core.database import Base, engine
from seed import seed_db

def reset_and_seed_database(db: Session):
    """Developer helper: completely resets tables and runs the seed script."""
    # Close any open connections and drop tables
    db.close()
    Base.metadata.drop_all(bind=engine)
    seed_db(force=True)
    return {"status": "ok", "message": "Database reset and re-seeded successfully"}
