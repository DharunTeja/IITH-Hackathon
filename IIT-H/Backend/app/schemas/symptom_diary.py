from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class SymptomDiaryBase(BaseModel):
    symptoms: str
    severity: int
    notes: Optional[str] = None


class SymptomDiaryCreate(SymptomDiaryBase):
    date: Optional[datetime] = None


class SymptomDiaryResponse(SymptomDiaryBase):
    id: int
    user_id: int
    date: datetime
    created_at: datetime

    class Config:
        from_attributes = True
