
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class DeviceBase(BaseModel):
    name: str
    type: str
    status: Optional[str] = 'active'
    battery_level: Optional[float] = 100.0
    location_x: Optional[float] = 0.0
    location_y: Optional[float] = 0.0
    is_online: Optional[bool] = True

class DeviceCreate(DeviceBase):
    pass

class DeviceUpdate(BaseModel):
    name: Optional[str] = None
    status: Optional[str] = None
    battery_level: Optional[float] = None
    location_x: Optional[float] = None
    location_y: Optional[float] = None
    is_online: Optional[bool] = None

class Device(DeviceBase):
    id: int
    last_updated: datetime

    class Config:
        from_attributes = True