
# Enterprise Monitoring Platform

A production-ready, real-time monitoring system for managing robots, servers, and sensors with enterprise-grade infrastructure.

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local frontend development)
- Python 3.11+ (for local backend development)

### Run with Docker (Recommended)
```bash
# Clone the repository
git clone https://github.com/yourusername/enterprise-monitoring-platform.git
cd enterprise-monitoring-platform

# Start all services
docker-compose up -d

# Check logs
docker-compose logs -f

# Stop services
docker-compose down
```

Access the application:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Local Development

**Backend:**
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your MySQL credentials
uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 🏗️ Architecture

### Tech Stack
- **Backend:** FastAPI (Python)
- **Frontend:** React + TypeScript + TailwindCSS
- **Database:** MySQL 8.0
- **Containerization:** Docker

### Features
- ✅ Real-time device monitoring
- ✅ RESTful API with auto-generated docs
- ✅ Responsive dashboard UI
- ✅ CRUD operations for devices
- ✅ Auto-refresh every 5 seconds
- ✅ Docker containerization
- ✅ Production-ready structure

## 📊 API Endpoints

- `GET /api/devices` - List all devices
- `GET /api/devices/{id}` - Get device by ID
- `POST /api/devices` - Create new device
- `PUT /api/devices/{id}` - Update device
- `DELETE /api/devices/{id}` - Delete device