# Enterprise Monitoring Platform

Real-time device monitoring system built for **Bear Robotics**, **Chartmetric**, and **Platoon** internship applications.

## 🎯 Project Goal
Demonstrate full-stack development skills with modern infrastructure practices in 7 days.

## 🛠 Tech Stack

### Backend
- **Python 3.11** - Core language
- **FastAPI** - High-performance API framework
- **SQLAlchemy** - ORM for database operations
- **MySQL 8.0** - Relational database
- **PyMySQL** - MySQL driver

### Frontend
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool
- **TailwindCSS** - Utility-first CSS
- **Axios** - HTTP client
- **Lucide React** - Icon library

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/mcha311/enterprise-monitoring-platform.git
cd enterprise-monitoring-platform
```

2. Start Backend + MySQL:
```bash
docker-compose up -d
```

3. Start Frontend:
```bash
cd frontend
npm install
npm run dev
```

### Access Points
- **Frontend Dashboard**: http://localhost:5173
- **API Documentation**: http://localhost:8000/docs
- **API Health Check**: http://localhost:8000/health

## 📊 Features

### Day 1 (Completed ✅)
- [x] Full-stack project setup
- [x] FastAPI backend with MySQL integration
- [x] React + TypeScript frontend
- [x] Docker containerization
- [x] RESTful API (CRUD operations)
- [x] Real-time dashboard UI
- [x] Responsive card layout
- [x] Auto-refresh every 5 seconds

### Day 2 (Completed ✅)
- [x] Alert System
- [x] Statistics Dashboard
- [x] Filtering System
- [x] Backend Testing
- [x] GitHub Actions CI


### Dashboard
![Dashboard](screenshots/dashboard.png)

### API Documentation
![API Docs](screenshots/api-docs.png)

## 🏗 Project Structure
```
enterprise-monitoring-platform/
├── backend/
│   ├── app/
│   │   ├── main.py           # FastAPI application
│   │   ├── database.py       # Database configuration
│   │   ├── models.py         # SQLAlchemy models
│   │   ├── schemas.py        # Pydantic schemas
│   │   └── routers/
│   │       └── devices.py    # Device endpoints
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── components/
│   │       └── Dashboard.tsx
│   ├── package.json
│   └── vite.config.ts
└── docker-compose.yml
```

## 🔄 API Endpoints

- `GET /` - Root endpoint
- `GET /health` - Health check
- `GET /devices/` - List all devices
- `POST /devices/` - Create new device
- `GET /devices/{id}` - Get device by ID
- `PUT /devices/{id}` - Update device
- `DELETE /devices/{id}` - Delete device

## 📅 Development Timeline

### Day 1 ✅ (January 21, 2025)
- Project initialization
- Backend API implementation
- Frontend dashboard
- Docker setup
- Basic CRUD operations

### Day 2 (Planned)
- [ ] WebSocket real-time updates
- [ ] Alert system (low battery warnings)
- [ ] Unit & integration tests
- [ ] GitHub Actions CI/CD
- [ ] Additional API endpoints

### Day 3-7 (Planned)
- Kubernetes deployment
- Terraform IaC
- Advanced monitoring (Prometheus/Grafana)
- Performance optimization
- Documentation