from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.dev_service import reset_and_seed_database

router = APIRouter()

@router.post("/reset")
def dev_reset_database(db: Session = Depends(get_db)):
    """Reset the database and re-seed clean test data."""
    return reset_and_seed_database(db)
