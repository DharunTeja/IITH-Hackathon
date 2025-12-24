from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    DateTime,
    Enum as SQLEnum,
)
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from database import Base


class ReminderType(str, enum.Enum):
    MEDICINE = "medicine"
    FOOD = "food"
    EXERCISE = "exercise"
    CUSTOM = "custom"


class Reminder(Base):
    __tablename__ = "reminders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    type = Column(SQLEnum(ReminderType), nullable=False)
    title = Column(String(100), nullable=False)
    time = Column(String(10), nullable=False)  # HH:MM
    is_active = Column(Integer, default=1)  # SQLite uses Integer for Boolean
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="reminders")
