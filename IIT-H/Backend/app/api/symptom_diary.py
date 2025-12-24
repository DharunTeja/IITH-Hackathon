from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from app.models.user import User
from app.utils.security import get_current_user
from app.models.symptom_diary import SymptomDiary
from app.schemas.symptom_diary import SymptomDiaryCreate, SymptomDiaryResponse
from datetime import datetime

router = APIRouter()


@router.get("/", response_model=List[SymptomDiaryResponse])
async def get_symptom_history(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    """Get symptom diary history"""
    entries = (
        db.query(SymptomDiary)
        .filter(SymptomDiary.user_id == current_user.id)
        .order_by(SymptomDiary.date.desc())
        .all()
    )
    return entries


@router.post(
    "/", response_model=SymptomDiaryResponse, status_code=status.HTTP_201_CREATED
)
async def create_symptom_entry(
    entry_data: SymptomDiaryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Add new symptom diary entry"""
    new_entry = SymptomDiary(
        user_id=current_user.id,
        date=entry_data.date or datetime.utcnow(),
        symptoms=entry_data.symptoms,
        severity=entry_data.severity,
        notes=entry_data.notes,
    )
    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)
    return new_entry
