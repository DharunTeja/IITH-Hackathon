from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class MessageBase(BaseModel):
    receiver_id: int
    message: str


class MessageCreate(MessageBase):
    pass


class MessageResponse(BaseModel):
    id: int
    sender_id: int
    receiver_id: int
    message: str
    timestamp: datetime
    is_read: bool
    sender_name: Optional[str] = None
    receiver_name: Optional[str] = None

    class Config:
        from_attributes = True
