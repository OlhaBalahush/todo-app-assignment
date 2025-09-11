# Backend - Spring Boot

RESTful API for the Todo application built with Spring Boot and PostgreSQL.

## How to run


1. **Start PostgreSQL**:
   ```bash
   # Using Docker
   docker run -d --name postgres -e POSTGRES_DB=todo_db -e POSTGRES_USER=todo_user -e POSTGRES_PASSWORD=todo_pass -p 5432:5432 postgres:15-alpine
   ```

2. **Run the application**:
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```

3. **API will be available at**: http://localhost:8080

## API endpoints

- `GET /api/todos` - Get all todos with optional filters(filters: status, dueBefore, text)
- `GET /api/todos/{id}` - Get todo by ID
- `POST /api/todos` - Create new todo (use ?parentId={id} for subtask)
- `PUT /api/todos/{id}` - Update todo
- `DELETE /api/todos/{id}` - Delete todo

## Structure

```
src/main/java/com/todo/backend/
├── controller/    # REST controllers
├── service/       # Business logic
├── repository/    # Data access layer
├── model/         # Entity classes
└── config/        # Configuration classes
```

## Tech stack

- **Framework**: Spring Boot 3.5
- **Language**: Java 17
- **Database**: PostgreSQL 15
- **ORM**: Spring Data JPA + Hibernate
- **Migrations**: Flyway
- **Build Tool**: Maven
- **Testing**: JUnit 5