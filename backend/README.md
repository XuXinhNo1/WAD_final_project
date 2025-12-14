# Backend - Smart Restaurant Table Management API

NestJS REST API for managing restaurant tables with PostgreSQL and Prisma ORM.

## Tech Stack

- **Framework**: NestJS 10.3.0
- **Database**: PostgreSQL 15
- **ORM**: Prisma 5.7.0
- **Language**: TypeScript
- **Validation**: class-validator, class-transformer

## Prerequisites

- Node.js 18+
- Docker (for PostgreSQL)
- npm or yarn

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the backend directory:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/smart_restaurant"
PORT=3000
```

## Database Setup

### 1. Start PostgreSQL with Docker

```bash
# From root directory
docker-compose up -d
```

### 2. Generate Prisma Client

```bash
npx prisma generate
```

### 3. Push schema to database

```bash
npx prisma db push
```

### 4. (Optional) Seed the database

```bash
npx prisma db seed
```

## Running the Application

### Development Mode (Hot Reload)

```bash
npm run start:dev
```

The API will be available at: http://localhost:3000/api

### Production Mode

```bash
npm run build
npm run start:prod
```

## API Endpoints

### Tables

#### Get all tables
```
GET /api/tables
Query params: status (ACTIVE|INACTIVE), location
```

#### Get single table
```
GET /api/tables/:id
```

#### Create table
```
POST /api/tables
Body: {
  "tableNumber": "T101",
  "capacity": 4,
  "location": "Main Hall",
  "description": "Optional description"
}
```

#### Update table
```
PUT /api/tables/:id
Body: {
  "tableNumber": "T101",
  "capacity": 6,
  "location": "VIP Room",
  "description": "Updated description"
}
```

#### Toggle table status
```
PATCH /api/tables/:id/status
```

#### Delete table
```
DELETE /api/tables/:id
```

#### Get locations
```
GET /api/tables/locations/list
```

## Database Management

### Open Prisma Studio
```bash
npx prisma studio
```

### Reset Database
```bash
npx prisma migrate reset
```

### View Database Schema
```bash
npx prisma db pull
```

## Project Structure

```
backend/
 prisma/
    schema.prisma       # Database schema
 src/
    main.ts            # Application entry point
    app.module.ts      # Root module
    tables/            # Tables module
        tables.controller.ts
        tables.service.ts
        tables.module.ts
        dto/           # Data Transfer Objects
 package.json
```

## Validation Rules

- **tableNumber**: Required, must be unique
- **capacity**: Required, must be between 1 and 20
- **location**: Optional
- **description**: Optional
- **status**: Defaults to ACTIVE

## Testing the API

### Using curl (Windows PowerShell)

```powershell
# Get all tables
curl http://localhost:3000/api/tables

# Create a table
curl -Method POST -Uri "http://localhost:3000/api/tables" `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"tableNumber":"T101","capacity":4,"location":"Main Hall"}'

# Update a table
curl -Method PUT -Uri "http://localhost:3000/api/tables/1" `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"tableNumber":"T101","capacity":6,"location":"VIP Room"}'

# Delete a table
curl -Method DELETE -Uri "http://localhost:3000/api/tables/1"
```

## Common Issues

### Port 3000 already in use
```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Database connection error
- Ensure Docker container is running
- Check DATABASE_URL in .env file
- Verify PostgreSQL credentials

## Scripts

- `npm run start:dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start:prod` - Start production server
- `npx prisma studio` - Open database GUI
- `npx prisma generate` - Generate Prisma Client
- `npx prisma db push` - Push schema to database

## License

MIT
