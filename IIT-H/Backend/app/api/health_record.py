from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from app.models.user import User
from app.utils.security import get_current_user
from app.models.health_record import HealthRecord
from app.schemas.health_record import HealthRecordResponse
import os
import shutil
from datetime import datetime

router_hr = APIRouter()


@router_hr.get("/", response_model=List[HealthRecordResponse])
async def get_health_records(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    """Get health records"""
    if current_user.role == "patient":
        records = (
            db.query(HealthRecord)
            .filter(HealthRecord.patient_id == current_user.id)
            .all()
        )
    else:
        # Doctors can view specific patient records via different endpoint
        records = []

    return records


@router_hr.post(
    "/", response_model=HealthRecordResponse, status_code=status.HTTP_201_CREATED
)
async def upload_health_record(
    file: UploadFile = File(...),
    title: str = "",
    record_type: str = "medical_document",
    notes: str = "",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Upload health record file"""
    if current_user.role != "patient":
        raise HTTPException(status_code=403, detail="Only patients can upload records")

    # Create directory based on type
    type_dir = record_type.replace("_", "-")
    upload_dir = f"uploads/{type_dir}"
    os.makedirs(upload_dir, exist_ok=True)

    # Generate unique filename
    timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    filename = f"{current_user.id}_{timestamp}_{file.filename}"
    file_path = f"{upload_dir}/{filename}"

    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Create database record
    new_record = HealthRecord(
        patient_id=current_user.id,
        type=record_type,
        title=title or file.filename,
        file_url=f"/{file_path}",
        notes=notes,
    )
    db.add(new_record)
    db.commit()
    db.refresh(new_record)

    return new_record
