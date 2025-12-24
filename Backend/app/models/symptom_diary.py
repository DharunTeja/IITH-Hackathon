from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


class SymptomDiary(Base):
    __tablename__ = "symptom_diary"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(DateTime, nullable=False, default=datetime.utcnow)
    symptoms = Column(String(500), nullable=False)
    severity = Column(Integer, nullable=False)  # 1-10 scale
    notes = Column(String(1000))
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="symptom_entries")
