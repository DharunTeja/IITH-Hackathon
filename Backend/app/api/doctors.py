from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from app.models.user import User
from app.utils.security import get_current_doctor
from app.schemas.user import UserResponse


router = APIRouter()


@router.get("/patients", response_model=List[UserResponse])
async def get_doctor_patients(
    current_user: User = Depends(get_current_doctor), db: Session = Depends(get_db)
):
    """Get list of patients for doctor"""
    from app.models.appointment import Appointment

    # Get unique patients who have appointments with this doctor
    patient_ids = (
        db.query(Appointment.patient_id)
        .filter(Appointment.doctor_id == current_user.id)
        .distinct()
        .all()
    )

    patient_ids = [pid[0] for pid in patient_ids]
    patients = db.query(User).filter(User.id.in_(patient_ids)).all()

    return patients


@router.get("/patient/{patient_id}/records")
async def get_patient_records(
    patient_id: int,
    current_user: User = Depends(get_current_doctor),
    db: Session = Depends(get_db),
):
    """Get patient's health records and history"""
    from app.models.health_record import HealthRecord
    from app.models.symptom_diary import SymptomDiary

    # Verify patient exists and has appointments with this doctor
    from app.models.appointment import Appointment

    has_appointment = (
        db.query(Appointment)
        .filter(
            Appointment.patient_id == patient_id,
            Appointment.doctor_id == current_user.id,
        )
        .first()
    )

    if not has_appointment:
        raise HTTPException(
            status_code=403, detail="No access to this patient's records"
        )

    records = db.query(HealthRecord).filter(HealthRecord.patient_id == patient_id).all()
    symptoms = (
        db.query(SymptomDiary)
        .filter(SymptomDiary.user_id == patient_id)
        .order_by(SymptomDiary.date.desc())
        .limit(10)
        .all()
    )

    return {"health_records": records, "recent_symptoms": symptoms}
