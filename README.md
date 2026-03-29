# Enterprise Monitoring Platform

Cloud-native microservices observability platform with real-time dashboards, automated alerting, Kubernetes deployment, and AWS infrastructure via Terraform.

---

## What It Does

Monitors the health and performance of multiple services from a unified dashboard:

- Real-time service status monitoring
- Automated alerts (low battery, service degradation, threshold breaches)
- Prometheus metrics collection + Grafana visualization
- Kubernetes-based deployment with auto-restart and health checks
- Full AWS infrastructure provisioned via Terraform

---

## Why This Stack?

| Technology | Why |
|------------|-----|
| **FastAPI** | High-performance async API framework. Built-in OpenAPI docs. Suited for high-frequency metric polling |
| **React + TypeScript** | Type-safe UI with compile-time error detection. TailwindCSS for rapid dashboard styling |
| **Prometheus** | Industry-standard metrics collection. Scrapes `/metrics` endpoints on a schedule and stores time-series data |
| **Grafana** | Connects to Prometheus and visualizes metrics as dashboards and graphs |
| **Kubernetes** | Auto-restarts failed containers, distributes load, enables zero-downtime rolling updates |
| **Terraform** | Infrastructure as Code — same AWS environment reproducible in minutes |
| **GitHub Actions** | Automated test → lint → build on every push |

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│              Docker / Kubernetes                │
│                                                 │
│  FastAPI Backend :8000                          │
│    GET /api/services        → service list      │
│    GET /api/services/{id}   → service detail    │
│    GET /api/alerts          → active alerts     │
│    GET /metrics             → Prometheus format │
│         │                                       │
│    MySQL :3306                                  │
│         │                                       │
│  React Frontend :3000 (Nginx)                   │
│         │                                       │
│  Prometheus :9090                               │
│    Scrapes /metrics every 15s                   │
│         │                                       │
│  Grafana :3001                                  │
│    Queries Prometheus → Dashboards              │
└─────────────────────────────────────────────────┘
```

**Data flow — alert generation:**
```
1. Prometheus scrapes FastAPI /metrics endpoint every 15s
2. FastAPI evaluates service states → generates alerts if threshold exceeded
3. Alert stored in MySQL + broadcast to connected frontends
4. Grafana dashboard updates in real time
```

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Backend | Python 3.11, FastAPI, SQLAlchemy, PyMySQL |
| Frontend | React 18, TypeScript, TailwindCSS, Vite, Axios |
| Monitoring | Prometheus, Grafana |
| Infrastructure | Docker, Docker Compose, Kubernetes (Minikube / EKS) |
| IaC | Terraform (AWS VPC, EKS, RDS) |
| CI/CD | GitHub Actions |

---

## CI/CD Pipeline

Every push to `main` automatically runs:

```
git push origin main
        │
        ├── test-backend
        │     PostgreSQL service container
        │     pytest tests/ --cov=app
        │     85%+ test coverage
        │
        ├── lint-backend
        │     flake8 style checks
        │
        └── test-frontend
              npm ci + npm run build
              TypeScript type validation
```

---

## AWS Infrastructure (Terraform)

```bash
cd infrastructure/terraform
terraform init
terraform plan     # preview changes
terraform apply    # provision VPC + EKS + RDS
```

Provisions:
- VPC with public/private subnets across 2 AZs
- EKS cluster with managed node group
- RDS MySQL (private subnet, encrypted)
- All IAM roles and security groups

---

## Kubernetes Deployment

```bash
kubectl apply -f infrastructure/k8s/

kubectl get pods
# monitoring-backend    Running  (livenessProbe: /health)
# monitoring-frontend   Running
# prometheus            Running
# grafana               Running
# mysql                 Running
```

All deployments include:
- `livenessProbe` — auto-restarts unhealthy pods
- `readinessProbe` — traffic withheld until pod is ready
- Resource `requests` / `limits`

---

## Quick Start

```bash
git clone https://github.com/mcha311/enterprise-monitoring-platform
cd enterprise-monitoring-platform

docker-compose up
```

- Dashboard: http://localhost:3000
- API: http://localhost:8000
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3001 (admin / admin)

---

## Testing

```bash
cd backend
pytest tests/ -v --cov=app
# 85%+ coverage
```

---

## Project Structure

```
enterprise-monitoring-platform/
├── backend/
│   ├── app/
│   │   ├── api/          # REST endpoints + /metrics
│   │   ├── models/       # SQLAlchemy models
│   │   └── services/     # Alert logic
│   └── tests/            # pytest (85%+ coverage)
├── frontend/             # React + TypeScript + TailwindCSS
├── infrastructure/
│   ├── k8s/              # Kubernetes manifests
│   └── terraform/        # AWS infrastructure modules
├── docker-compose.yml
└── .github/workflows/    # CI pipeline
```

---

## Development Timeline
This project served as the foundation for [Servi Fleet Manager](https://github.com/mcha311/servi-fleet-manager), which extended the same infrastructure patterns with ROS2 robotics integration.

<img width="1780" height="1584" alt="image" src="https://github.com/user-attachments/assets/cd2e33b2-e286-4376-a02a-b1f35f0814ce" />

<img width="1792" height="1508" alt="image" src="https://github.com/user-attachments/assets/2d3cdea2-6997-46a6-8c5f-473a99388be2" />

