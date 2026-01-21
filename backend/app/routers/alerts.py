from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/alerts", tags=["alerts"])

@router.get("/low-battery", response_model=List[schemas.Device])
def get_low_battery_devices(threshold: float = 20.0, db: Session = Depends(get_db)):
    """배터리가 낮은 디바이스 조회"""
    devices = db.query(models.Device).filter(
        models.Device.battery_level < threshold,
        models.Device.is_online == True
    ).all()
    return devices

@router.get("/offline", response_model=List[schemas.Device])
def get_offline_devices(db: Session = Depends(get_db)):
    """오프라인 디바이스 조회"""
    devices = db.query(models.Device).filter(
        models.Device.is_online == False
    ).all()
    return devices

@router.get("/critical", response_model=List[schemas.Device])
def get_critical_devices(db: Session = Depends(get_db)):
    """긴급 상태 디바이스 (배터리 < 10% 또는 에러 상태)"""
    devices = db.query(models.Device).filter(
        (models.Device.battery_level < 10) | 
        (models.Device.status == 'error')
    ).all()
    return devices