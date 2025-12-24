from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class HealthRecordBase(BaseModel):
    type: str
    title: str
    notes: Optional[str] = None


class HealthRecordCreate(HealthRecordBase):
    pass


class HealthRecordResponse(HealthRecordBase):
    id: int
    patient_id: int
    file_url: str
    uploaded_at: datetime

    class Config:
        from_attributes = True
