from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


class Prescription(Base):
    __tablename__ = "prescriptions"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    doctor_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    medicine = Column(String(100), nullable=False)
    dosage = Column(String(50), nullable=False)
    timing = Column(String(200), nullable=False)  # e.g., "Morning, Evening"
    duration = Column(String(50))  # e.g., "7 days"
    notes = Column(String(500))
    created_at = Column(DateTime, default=datetime.utcnow)

    patient = relationship(
        "User", foreign_keys=[patient_id], back_populates="patient_prescriptions"
    )
    doctor = relationship(
        "User", foreign_keys=[doctor_id], back_populates="doctor_prescriptions"
    )
