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


class RecordType(str, enum.Enum):
    LAB_REPORT = "lab_report"
    PRESCRIPTION = "prescription"
    MEDICAL_DOCUMENT = "medical_document"
    IMAGING = "imaging"


class HealthRecord(Base):
    __tablename__ = "health_records"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    type = Column(SQLEnum(RecordType), nullable=False)
    title = Column(String(200), nullable=False)
    file_url = Column(String(500), nullable=False)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    notes = Column(String(500))

    patient = relationship("User", back_populates="health_records")
