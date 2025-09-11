#!/bin/bash

# Todo Application Docker Setup Script
# This script sets up and runs the Todo Application using Docker Compose

set -e

echo "🚀 Setting up Todo Application with Docker..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop and try again."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose and try again."
    exit 1
fi

echo "✅ Docker is running"

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p logs

# Build and start services
echo "🔨 Building and starting services..."
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check service health
echo "🏥 Checking service health..."

# Check database
if docker-compose exec -T database pg_isready -U todo_user -d todo_db > /dev/null 2>&1; then
    echo "✅ Database is ready"
else
    echo "❌ Database is not ready"
    docker-compose logs database
    exit 1
fi

# Check backend
if curl -f http://localhost:8080/actuator/health > /dev/null 2>&1; then
    echo "✅ Backend is ready"
else
    echo "❌ Backend is not ready"
    docker-compose logs backend
    exit 1
fi

# Check frontend
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend is ready"
else
    echo "❌ Frontend is not ready"
    docker-compose logs frontend
    exit 1
fi

echo ""
echo "🎉 Todo Application is now running!"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8080"
echo "🗄️  Database: localhost:5432"
echo ""
echo "📊 Useful commands:"
echo "  View logs: docker-compose logs -f"
echo "  Stop services: docker-compose down"
echo "  Restart: docker-compose restart"
echo "  Status: docker-compose ps"
echo ""
echo "🔍 To test the API:"
echo "  curl http://localhost:8080/api/todos"
echo ""
echo "Happy coding! 🚀"