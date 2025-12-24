from sqlalchemy import Column, Integer, String, Enum as SQLEnum, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from database import Base


class UserRole(str, enum.Enum):
    PATIENT = "patient"
    DOCTOR = "doctor"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(SQLEnum(UserRole), nullable=False, default=UserRole.PATIENT)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    medications = relationship(
        "Medication", back_populates="user", cascade="all, delete-orphan"
    )
    reminders = relationship(
        "Reminder", back_populates="user", cascade="all, delete-orphan"
    )
    symptom_entries = relationship(
        "SymptomDiary", back_populates="user", cascade="all, delete-orphan"
    )
    sent_messages = relationship(
        "Message", foreign_keys="Message.sender_id", back_populates="sender"
    )
    received_messages = relationship(
        "Message", foreign_keys="Message.receiver_id", back_populates="receiver"
    )

    # Patient relationships
    patient_appointments = relationship(
        "Appointment", foreign_keys="Appointment.patient_id", back_populates="patient"
    )
    health_records = relationship("HealthRecord", back_populates="patient")
    patient_prescriptions = relationship(
        "Prescription", foreign_keys="Prescription.patient_id", back_populates="patient"
    )

    # Doctor relationships
    doctor_appointments = relationship(
        "Appointment", foreign_keys="Appointment.doctor_id", back_populates="doctor"
    )
    doctor_prescriptions = relationship(
        "Prescription", foreign_keys="Prescription.doctor_id", back_populates="doctor"
    )
