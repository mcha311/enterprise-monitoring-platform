from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc, asc
from typing import List, Optional
from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/devices", tags=["devices"])

@router.get("/", response_model=List[schemas.Device])
def get_devices(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Max number of records to return"),
    search: Optional[str] = Query(None, description="Search by name or type"),
    type_filter: Optional[str] = Query(None, description="Filter by type (robot/server)"),
    status_filter: Optional[str] = Query(None, description="Filter by status (active/inactive/error)"),
    sort_by: Optional[str] = Query("id", description="Sort by field (id/name/battery_level/last_updated)"),
    sort_order: Optional[str] = Query("asc", description="Sort order (asc/desc)"),
    db: Session = Depends(get_db)
):
    """
    Get devices with pagination, search, filtering, and sorting
    
    - **skip**: Number of records to skip (for pagination)
    - **limit**: Maximum number of records to return
    - **search**: Search in name and type fields
    - **type_filter**: Filter by device type
    - **status_filter**: Filter by status
    - **sort_by**: Field to sort by
    - **sort_order**: asc or desc
    """
    query = db.query(models.Device)
    
    # Search
    if search:
        query = query.filter(
            or_(
                models.Device.name.ilike(f"%{search}%"),
                models.Device.type.ilike(f"%{search}%")
            )
        )
    
    # Filter by type
    if type_filter:
        query = query.filter(models.Device.type == type_filter)
    
    # Filter by status
    if status_filter:
        query = query.filter(models.Device.status == status_filter)
    
    # Sorting
    sort_field = getattr(models.Device, sort_by, models.Device.id)
    if sort_order == "desc":
        query = query.order_by(desc(sort_field))
    else:
        query = query.order_by(asc(sort_field))
    
    # Pagination
    devices = query.offset(skip).limit(limit).all()
    return devices

@router.get("/count")
def get_device_count(
    search: Optional[str] = None,
    type_filter: Optional[str] = None,
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get total count of devices (for pagination)"""
    query = db.query(models.Device)
    
    if search:
        query = query.filter(
            or_(
                models.Device.name.ilike(f"%{search}%"),
                models.Device.type.ilike(f"%{search}%")
            )
        )
    
    if type_filter:
        query = query.filter(models.Device.type == type_filter)
    
    if status_filter:
        query = query.filter(models.Device.status == status_filter)
    
    total = query.count()
    return {"total": total}

@router.post("/", response_model=schemas.Device)
def create_device(device: schemas.DeviceCreate, db: Session = Depends(get_db)):
    """Create a new device"""
    db_device = models.Device(**device.dict())
    db.add(db_device)
    db.commit()
    db.refresh(db_device)
    return db_device

@router.get("/{device_id}", response_model=schemas.Device)
def get_device(device_id: int, db: Session = Depends(get_db)):
    """Get a device by ID"""
    device = db.query(models.Device).filter(models.Device.id == device_id).first()
    if device is None:
        raise HTTPException(status_code=404, detail="Device not found")
    return device

@router.put("/{device_id}", response_model=schemas.Device)
def update_device(device_id: int, device: schemas.DeviceUpdate, db: Session = Depends(get_db)):
    """Update a device"""
    db_device = db.query(models.Device).filter(models.Device.id == device_id).first()
    if db_device is None:
        raise HTTPException(status_code=404, detail="Device not found")
    
    for key, value in device.dict(exclude_unset=True).items():
        setattr(db_device, key, value)
    
    db.commit()
    db.refresh(db_device)
    return db_device

@router.delete("/{device_id}")
def delete_device(device_id: int, db: Session = Depends(get_db)):
    """Delete a device"""
    device = db.query(models.Device).filter(models.Device.id == device_id).first()
    if device is None:
        raise HTTPException(status_code=404, detail="Device not found")
    
    db.delete(device)
    db.commit()
    return {"message": "Device deleted successfully"}

@router.post("/bulk")
def create_bulk_devices(devices: List[schemas.DeviceCreate], db: Session = Depends(get_db)):
    """Create multiple devices at once"""
    db_devices = [models.Device(**device.dict()) for device in devices]
    db.add_all(db_devices)
    db.commit()
    return {"message": f"Created {len(db_devices)} devices"}