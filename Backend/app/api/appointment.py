from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from app.models.user import User
from app.utils.security import get_current_user
from app.models.appointment import Appointment
from app.schemas.appointment import (
    AppointmentCreate,
    AppointmentResponse,
    AppointmentUpdate,
)
from app.utils.security import get_current_doctor

router = APIRouter()


@router.get("/", response_model=List[AppointmentResponse])
async def get_appointments(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    """Get appointments for current user"""
    if current_user.role == "patient":
        appointments = (
            db.query(Appointment)
            .filter(Appointment.patient_id == current_user.id)
            .all()
        )
    else:  # doctor
        appointments = (
            db.query(Appointment).filter(Appointment.doctor_id == current_user.id).all()
        )

    # Add user names
    for appt in appointments:
        appt.patient_name = appt.patient.name
        appt.doctor_name = appt.doctor.name

    return appointments


@router.post(
    "/", response_model=AppointmentResponse, status_code=status.HTTP_201_CREATED
)
async def create_appointment(
    appointment_data: AppointmentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Request new appointment (Patient only)"""
    if current_user.role != "patient":
        raise HTTPException(
            status_code=403, detail="Only patients can request appointments"
        )

    # Verify doctor exists
    doctor = (
        db.query(User)
        .filter(User.id == appointment_data.doctor_id, User.role == "doctor")
        .first()
    )
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")

    new_appointment = Appointment(patient_id=current_user.id, **appointment_data.dict())
    db.add(new_appointment)
    db.commit()
    db.refresh(new_appointment)

    new_appointment.patient_name = current_user.name
    new_appointment.doctor_name = doctor.name
    return new_appointment


@router.put("/{appointment_id}", response_model=AppointmentResponse)
async def update_appointment_status(
    appointment_id: int,
    status_data: AppointmentUpdate,
    current_user: User = Depends(get_current_doctor),
    db: Session = Depends(get_db),
):
    """Update appointment status (Doctor only)"""
    appointment = (
        db.query(Appointment)
        .filter(
            Appointment.id == appointment_id, Appointment.doctor_id == current_user.id
        )
        .first()
    )

    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    appointment.status = status_data.status
    db.commit()
    db.refresh(appointment)

    appointment.patient_name = appointment.patient.name
    appointment.doctor_name = current_user.name
    return appointment
