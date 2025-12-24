from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from app.models.user import User
from app.utils.security import get_current_user

router = APIRouter()


@router.get("/dashboard")
async def get_patient_dashboard(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    """Get patient dashboard overview"""
    from app.models.medications import Medication
    from app.models.reminder import Reminder
    from app.models.appointment import Appointment
    from datetime import datetime

    if current_user.role != "patient":
        raise HTTPException(status_code=403, detail="Only patients can access this")

    # Get today's medications
    medications = (
        db.query(Medication).filter(Medication.user_id == current_user.id).all()
    )

    # Get active reminders
    reminders = (
        db.query(Reminder)
        .filter(Reminder.user_id == current_user.id, Reminder.is_active == 1)
        .all()
    )

    # Get upcoming appointments
    today = datetime.utcnow()
    upcoming = (
        db.query(Appointment)
        .filter(
            Appointment.patient_id == current_user.id,
            Appointment.date >= today,
            Appointment.status == "approved",
        )
        .order_by(Appointment.date)
        .limit(5)
        .all()
    )

    # Add doctor names
    for appt in upcoming:
        appt.doctor_name = appt.doctor.name

    return {
        "medications": medications,
        "reminders": reminders,
        "upcoming_appointments": upcoming,
        "low_stock_meds": [
            m for m in medications if m.stock_level in ["critical", "low"]
        ],
    }
