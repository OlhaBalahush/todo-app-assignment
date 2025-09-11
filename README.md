# Todo Application

Todo App for managing tasks, with subtasks, deadlines, and smart filtering.
Built with a React frontend and a Spring Boot backend, fully containerized with Docker.

## Features implemented

- CRUD operations for todos to support the frontend
- Endpoint to fetch a list of todos according to a filter. When multiple filters are specified then results must match all (Done / Not done, Due date, Text search which matches any part of a todo description)
- Can add todos under todos (infinitely)
- Filtering optimized so that it can handle 1 000 000 todos

## How to run

1. Clone repository
2. Run
   ```bash
    docker-compose up -d
   ```
3. Access application at http://localhost:3000

### Test Data Included

The application comes with **pre-loaded test data** including:
- 10 main todos with various statuses (TODO/DONE)
- 25+ subtasks with realistic content
- Different due dates and categories
- Sample data for testing all features

Test data is automatically loaded via Flyway migrations when using Docker.

## Project Structure

```
├── frontend/     
├── backend/
└── docker-compose.yml 
```
## Tech stack

- **Frontend**: React 19 + TypeScript + Material-UI
- **Backend**: Spring Boot 3.5 + Java 17 + PostgreSQL
- **Database**: PostgreSQL 15 with Flyway migrations
- **Containerization**: Docker + Docker Compose

## Documentation

- [Frontend Documentation](frontend/README.md)
- [Backend Documentation](backend/README.md)
- [Docker Documentation](DOCKER.md)