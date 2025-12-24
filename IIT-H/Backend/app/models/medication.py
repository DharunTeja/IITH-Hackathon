from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from database import Base


class StockLevel(str, enum.Enum):
    CRITICAL = "critical"  # < 5 tablets
    LOW = "low"  # 5-10 tablets
    MEDIUM = "medium"  # 11-20 tablets
    HIGH = "high"  # > 20 tablets


class Medication(Base):
    __tablename__ = "medications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(100), nullable=False)
    dosage = Column(String(50), nullable=False)
    time = Column(String(10), nullable=False)  # HH:MM format
    total_tablets = Column(Integer, nullable=False)
    remaining_tablets = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="medications")

    @property
    def stock_level(self) -> StockLevel:
        if self.remaining_tablets < 5:
            return StockLevel.CRITICAL
        elif self.remaining_tablets <= 10:
            return StockLevel.LOW
        elif self.remaining_tablets <= 20:
            return StockLevel.MEDIUM
        return StockLevel.HIGH
