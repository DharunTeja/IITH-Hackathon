from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from app.models.user import User
from app.utils.security import get_current_user
from app.models.reminder import Reminder
from app.schemas.reminder import ReminderCreate, ReminderResponse

router = APIRouter()


@router.get("/", response_model=List[ReminderResponse])
async def get_reminders(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    """Get all reminders for current user"""
    reminders = (
        db.query(Reminder)
        .filter(Reminder.user_id == current_user.id, Reminder.is_active == 1)
        .all()
    )
    return reminders


@router.post("/", response_model=ReminderResponse, status_code=status.HTTP_201_CREATED)
async def create_reminder(
    reminder_data: ReminderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create new reminder"""
    new_reminder = Reminder(user_id=current_user.id, **reminder_data.dict())
    db.add(new_reminder)
    db.commit()
    db.refresh(new_reminder)
    return new_reminder
