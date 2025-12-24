from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class PrescriptionBase(BaseModel):
    patient_id: int
    medicine: str
    dosage: str
    timing: str
    duration: Optional[str] = None
    notes: Optional[str] = None


class PrescriptionCreate(PrescriptionBase):
    pass


class PrescriptionResponse(PrescriptionBase):
    id: int
    doctor_id: int
    created_at: datetime
    doctor_name: Optional[str] = None

    class Config:
        from_attributes = True
