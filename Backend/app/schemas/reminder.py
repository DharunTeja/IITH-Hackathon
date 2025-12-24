from pydantic import BaseModel
from datetime import datetime


class ReminderBase(BaseModel):
    type: str
    title: str
    time: str


class ReminderCreate(ReminderBase):
    pass


class ReminderResponse(ReminderBase):
    id: int
    user_id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
