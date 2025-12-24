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


class AppointmentStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    doctor_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(DateTime, nullable=False)
    reason = Column(String(500))
    status = Column(SQLEnum(AppointmentStatus), default=AppointmentStatus.PENDING)
    created_at = Column(DateTime, default=datetime.utcnow)

    patient = relationship(
        "User", foreign_keys=[patient_id], back_populates="patient_appointments"
    )
    doctor = relationship(
        "User", foreign_keys=[doctor_id], back_populates="doctor_appointments"
    )
