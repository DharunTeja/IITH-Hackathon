from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from app.models.user import User
from app.models.prescription import Prescription
from app.schemas.prescription import PrescriptionCreate, PrescriptionResponse
from app.utils.security import get_current_user, get_current_doctor

router = APIRouter()


@router.get("/", response_model=List[PrescriptionResponse])
async def get_prescriptions(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    """Get prescriptions (patient sees their own, doctor sees their created ones)"""
    if current_user.role == "patient":
        prescriptions = (
            db.query(Prescription)
            .filter(Prescription.patient_id == current_user.id)
            .all()
        )
    else:
        prescriptions = (
            db.query(Prescription)
            .filter(Prescription.doctor_id == current_user.id)
            .all()
        )

    for rx in prescriptions:
        rx.doctor_name = rx.doctor.name

    return prescriptions


@router.post(
    "/", response_model=PrescriptionResponse, status_code=status.HTTP_201_CREATED
)
async def create_prescription(
    prescription_data: PrescriptionCreate,
    current_user: User = Depends(get_current_doctor),
    db: Session = Depends(get_db),
):
    """Create prescription (Doctor only)"""
    # Verify patient exists
    patient = (
        db.query(User)
        .filter(User.id == prescription_data.patient_id, User.role == "patient")
        .first()
    )

    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    new_prescription = Prescription(
        doctor_id=current_user.id, **prescription_data.dict()
    )
    db.add(new_prescription)
    db.commit()
    db.refresh(new_prescription)

    new_prescription.doctor_name = current_user.name
    return new_prescription
