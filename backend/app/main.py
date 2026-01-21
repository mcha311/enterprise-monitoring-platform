from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import devices, alerts

# 데이터베이스 테이블 생성
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Enterprise Monitoring Platform API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(devices.router)
app.include_router(alerts.router)

@app.get("/")
def read_root():
    return {"message": "Enterprise Monitoring Platform API", "status": "running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}