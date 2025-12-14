@echo off
echo ========================================
echo Smart Restaurant - Quick Start
echo ========================================
echo.

echo Checking Docker status...
docker ps >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Docker is not running
    echo Starting Docker Desktop...
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    echo Please wait for Docker to start, then press any key...
    pause >nul
)

echo.
echo Starting PostgreSQL...
docker-compose up -d

echo.
echo Opening Prisma Studio...
start http://localhost:5555
call npx prisma studio

pause
