from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from app.models.user import User
from app.models.medications import Medication
from app.schemas.medications import (
    MedicationCreate,
    MedicationResponse,
    MedicationUpdate,
)
from app.utils.security import get_current_user

router = APIRouter()


@router.get("/", response_model=List[MedicationResponse])
async def get_medications(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    """Get all medications for current user"""
    medications = (
        db.query(Medication).filter(Medication.user_id == current_user.id).all()
    )
    return medications


@router.post(
    "/", response_model=MedicationResponse, status_code=status.HTTP_201_CREATED
)
async def create_medication(
    medication_data: MedicationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Add new medication"""
    new_medication = Medication(user_id=current_user.id, **medication_data.dict())
    db.add(new_medication)
    db.commit()
    db.refresh(new_medication)
    return new_medication


@router.put("/{medication_id}", response_model=MedicationResponse)
async def update_medication(
    medication_id: int,
    medication_data: MedicationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update medication (e.g., tablet count)"""
    medication = (
        db.query(Medication)
        .filter(Medication.id == medication_id, Medication.user_id == current_user.id)
        .first()
    )

    if not medication:
        raise HTTPException(status_code=404, detail="Medication not found")

    update_data = medication_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(medication, key, value)

    db.commit()
    db.refresh(medication)
    return medication


@router.delete("/{medication_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_medication(
    medication_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete medication"""
    medication = (
        db.query(Medication)
        .filter(Medication.id == medication_id, Medication.user_id == current_user.id)
        .first()
    )

    if not medication:
        raise HTTPException(status_code=404, detail="Medication not found")

    db.delete(medication)
    db.commit()
