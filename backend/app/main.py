from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import devices, alerts

app = FastAPI(title="Enterprise Monitoring Platform API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(devices.router)
app.include_router(alerts.router)

@app.on_event("startup")
async def startup_event():
    """앱 시작 시 DB 초기화"""
    from .database import engine, Base
    Base.metadata.create_all(bind=engine)

@app.get("/")
def read_root():
    return {"message": "Enterprise Monitoring Platform API", "status": "running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}