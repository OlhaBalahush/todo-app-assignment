# Docker

Containerization setup for the application using docker compose

## How to run

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```


## Docker files

```
├── docker-compose.yml    # Service orchestration
├── backend/Dockerfile    # Spring Boot container
├── frontend/Dockerfile   # React + Nginx container
└── frontend/nginx.conf   # Nginx configuration
```