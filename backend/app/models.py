
from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean
from datetime import datetime
from .database import Base

class Device(Base):
    __tablename__ = "devices"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    type = Column(String(50), nullable=False)  # 'robot', 'server', 'sensor'
    status = Column(String(20), default='active')  # 'active', 'inactive', 'error'
    battery_level = Column(Float, default=100.0)
    location_x = Column(Float, default=0.0)
    location_y = Column(Float, default=0.0)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_online = Column(Boolean, default=True)