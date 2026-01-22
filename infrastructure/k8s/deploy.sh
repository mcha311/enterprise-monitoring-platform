#!/bin/bash

set -e

echo "🔧 Setting up Minikube Docker environment..."
eval $(minikube docker-env)

echo "🐳 Building Docker images..."
# 루트 디렉토리로 이동
PROJECT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$PROJECT_ROOT"

# Backend 빌드
echo "Building backend..."
docker build -t enterprise-monitoring-platform-backend:latest ./backend

# Frontend 빌드  
echo "Building frontend..."
docker build -t enterprise-monitoring-platform-frontend:latest ./frontend

echo "☸️  Creating namespace..."
kubectl apply -f infrastructure/k8s/namespace.yaml

echo "🚀 Deploying MySQL..."
kubectl apply -f infrastructure/k8s/mysql.yaml

echo "⏳ Waiting for MySQL to be ready..."
kubectl wait --for=condition=ready pod -l app=mysql -n monitoring --timeout=120s

echo "🚀 Deploying Backend..."
kubectl apply -f infrastructure/k8s/backend.yaml

echo "⏳ Waiting for Backend to be ready..."
kubectl wait --for=condition=ready pod -l app=backend -n monitoring --timeout=120s

echo "🚀 Deploying Frontend..."
kubectl apply -f infrastructure/k8s/frontend.yaml

echo "⏳ Waiting for Frontend to be ready..."
kubectl wait --for=condition=ready pod -l app=frontend -n monitoring --timeout=120s

echo "✅ Deployment complete!"
echo ""
echo "📊 Status:"
kubectl get pods -n monitoring
echo ""
echo "🌐 Access Frontend:"
minikube service frontend -n monitoring --url
echo ""
echo "🔍 Useful commands:"
echo "  kubectl get pods -n monitoring"
echo "  kubectl logs -f deployment/backend -n monitoring"
echo "  kubectl logs -f deployment/frontend -n monitoring"
echo "  minikube dashboard"