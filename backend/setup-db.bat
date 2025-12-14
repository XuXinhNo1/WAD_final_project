@echo off
echo ========================================
echo Smart Restaurant - Database Setup
echo ========================================
echo.

echo [1/5] Checking Docker...
docker ps >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running!
    echo Please start Docker Desktop and run this script again.
    pause
    exit /b 1
)
echo ✅ Docker is running

echo.
echo [2/5] Starting PostgreSQL container...
docker-compose up -d
if errorlevel 1 (
    echo ❌ Failed to start PostgreSQL container
    pause
    exit /b 1
)
echo ✅ PostgreSQL container started

echo.
echo [3/5] Waiting for database to be ready...
timeout /t 10 /nobreak >nul
echo ✅ Database is ready

echo.
echo [4/5] Generating Prisma Client...
call npx prisma generate
if errorlevel 1 (
    echo ❌ Failed to generate Prisma Client
    pause
    exit /b 1
)
echo ✅ Prisma Client generated

echo.
echo [5/5] Creating database tables...
call npx prisma db push --accept-data-loss
if errorlevel 1 (
    echo ❌ Failed to create database tables
    pause
    exit /b 1
)
echo ✅ Database tables created

echo.
echo ========================================
echo 🎉 Database setup completed!
echo ========================================
echo.
echo Next steps:
echo 1. Run seed: npm run db:seed
echo 2. Open Prisma Studio: npm run db:studio
echo 3. View in browser: http://localhost:5555
echo.
pause
