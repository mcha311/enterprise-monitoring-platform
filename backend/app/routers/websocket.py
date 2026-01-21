from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..websocket_manager import manager
from .. import models
import asyncio

router = APIRouter()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, db: Session = Depends(get_db)):
    await manager.connect(websocket)
    try:
        while True:
            try:
                await asyncio.wait_for(websocket.receive_text(), timeout=1.0)
            except asyncio.TimeoutError:
                pass
            
            devices = db.query(models.Device).all()
            devices_data = []
            
            for device in devices:
                devices_data.append({
                    "id": device.id,
                    "name": device.name,
                    "type": device.type,
                    "status": device.status,
                    "battery_level": device.battery_level,
                    "location_x": device.location_x,
                    "location_y": device.location_y,
                    "is_online": device.is_online,
                    "last_updated": device.last_updated.isoformat()
                })
            
            await manager.broadcast({
                "type": "devices_update",
                "data": devices_data
            })
            
            await asyncio.sleep(2)
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        print(f"WebSocket error: {e}")
        manager.disconnect(websocket)