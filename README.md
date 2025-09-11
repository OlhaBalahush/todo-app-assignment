# todo-app-assignment

## Backend

### Current state
- Spring Boot project initialized
- H2 in-memory database configured
- Runs on `http://localhost:8080`


## Frontend

I chose to use **React with TypeScript** instead of plain JavaScript because:
- TypeScript is a superset of JavaScript (all JS code is valid TS).
- Provides stronger type safety, which reduces runtime errors.
- Improves developer experience with autocompletion and clearer contracts between backend and frontend.
- Makes the codebase easier to scale and maintain.

If required, this frontend can easily be migrated to plain JavaScript by removing type annotations,
but TypeScript brings practical advantages while staying aligned with the intent of the requirements.

### Current state
- React app with TypeScript
- Connected to backend API
- Runs on `http://localhost:3000`

### How to run
```bash
cd backend
./mvnw spring-boot:run

cd ..
cd frontend
npm install
npm start