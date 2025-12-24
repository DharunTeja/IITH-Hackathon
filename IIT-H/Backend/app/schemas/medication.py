from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class MedicationBase(BaseModel):
    name: str
    dosage: str
    time: str
    total_tablets: int
    remaining_tablets: int


class MedicationCreate(MedicationBase):
    pass


class MedicationUpdate(BaseModel):
    remaining_tablets: Optional[int] = None
    time: Optional[str] = None


class MedicationResponse(MedicationBase):
    id: int
    user_id: int
    stock_level: str
    created_at: datetime

    class Config:
        from_attributes = True
