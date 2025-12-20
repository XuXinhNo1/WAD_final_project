# Deployment Quick Start Scripts

## Backend Deployment to Heroku

### Prerequisites Check
```bash
# Check if Heroku CLI is installed
heroku --version

# Login to Heroku
heroku login
```

### One-Command Deploy

#### Windows (PowerShell)
Save as `deploy-backend.ps1`:
```powershell
# Deploy Backend to Heroku
Write-Host "🚀 Deploying Backend to Heroku..." -ForegroundColor Green

cd backend

# Check if Heroku app exists
$appName = Read-Host "Enter your Heroku app name (or press Enter to create new)"

if ($appName -eq "") {
    $appName = Read-Host "Enter name for new Heroku app"
    Write-Host "Creating Heroku app: $appName"
    heroku create $appName
}

# Add PostgreSQL addon if not exists
Write-Host "Adding PostgreSQL addon..."
heroku addons:create heroku-postgresql:mini -a $appName

# Set environment variables
Write-Host "Setting environment variables..."
$jwtSecret = Read-Host "Enter JWT_SECRET (or press Enter for default)"
if ($jwtSecret -eq "") {
    $jwtSecret = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
}

heroku config:set JWT_SECRET=$jwtSecret -a $appName
heroku config:set NODE_ENV=production -a $appName

$frontendUrl = Read-Host "Enter FRONTEND_URL (e.g., https://your-app.netlify.app)"
heroku config:set FRONTEND_URL=$frontendUrl -a $appName

# Deploy
Write-Host "Deploying code..."
git push heroku main

# Run migrations
Write-Host "Running database migrations..."
heroku run npx prisma migrate deploy -a $appName

# Seed database (optional)
$seed = Read-Host "Seed database? (y/n)"
if ($seed -eq "y") {
    heroku run npm run db:seed -a $appName
}

Write-Host "✅ Backend deployed successfully!" -ForegroundColor Green
Write-Host "Your API is available at: https://$appName.herokuapp.com/api"

cd ..
```

#### Linux/Mac (Bash)
Save as `deploy-backend.sh`:
```bash
#!/bin/bash

# Deploy Backend to Heroku
echo "🚀 Deploying Backend to Heroku..."

cd backend

# Check if Heroku app exists
read -p "Enter your Heroku app name (or press Enter to create new): " appName

if [ -z "$appName" ]; then
    read -p "Enter name for new Heroku app: " appName
    echo "Creating Heroku app: $appName"
    heroku create $appName
fi

# Add PostgreSQL addon if not exists
echo "Adding PostgreSQL addon..."
heroku addons:create heroku-postgresql:mini -a $appName

# Set environment variables
echo "Setting environment variables..."
read -p "Enter JWT_SECRET (or press Enter for auto-generate): " jwtSecret
if [ -z "$jwtSecret" ]; then
    jwtSecret=$(openssl rand -base64 32)
fi

heroku config:set JWT_SECRET=$jwtSecret -a $appName
heroku config:set NODE_ENV=production -a $appName

read -p "Enter FRONTEND_URL (e.g., https://your-app.netlify.app): " frontendUrl
heroku config:set FRONTEND_URL=$frontendUrl -a $appName

# Deploy
echo "Deploying code..."
git push heroku main

# Run migrations
echo "Running database migrations..."
heroku run npx prisma migrate deploy -a $appName

# Seed database (optional)
read -p "Seed database? (y/n): " seed
if [ "$seed" == "y" ]; then
    heroku run npm run db:seed -a $appName
fi

echo "✅ Backend deployed successfully!"
echo "Your API is available at: https://$appName.herokuapp.com/api"

cd ..
```

## Frontend Deployment to Netlify

### Windows (PowerShell)
Save as `deploy-frontend.ps1`:
```powershell
# Deploy Frontend to Netlify
Write-Host "🚀 Deploying Frontend to Netlify..." -ForegroundColor Green

cd frontend

# Check if Netlify CLI is installed
$netlifyInstalled = Get-Command netlify -ErrorAction SilentlyContinue
if (-not $netlifyInstalled) {
    Write-Host "Installing Netlify CLI..."
    npm install -g netlify-cli
}

# Login to Netlify
netlify login

# Get API URL
$apiUrl = Read-Host "Enter your backend API URL (e.g., https://your-api.herokuapp.com/api)"

# Create .env.production
Write-Host "Creating .env.production file..."
@"
REACT_APP_API_URL=$apiUrl
"@ | Out-File -FilePath .env.production -Encoding utf8

# Build the app
Write-Host "Building frontend..."
npm run build

# Deploy
Write-Host "Deploying to Netlify..."
netlify deploy --prod --dir=build

Write-Host "✅ Frontend deployed successfully!" -ForegroundColor Green

cd ..
```

### Linux/Mac (Bash)
Save as `deploy-frontend.sh`:
```bash
#!/bin/bash

# Deploy Frontend to Netlify
echo "🚀 Deploying Frontend to Netlify..."

cd frontend

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "Installing Netlify CLI..."
    npm install -g netlify-cli
fi

# Login to Netlify
netlify login

# Get API URL
read -p "Enter your backend API URL (e.g., https://your-api.herokuapp.com/api): " apiUrl

# Create .env.production
echo "Creating .env.production file..."
cat > .env.production << EOF
REACT_APP_API_URL=$apiUrl
EOF

# Build the app
echo "Building frontend..."
npm run build

# Deploy
echo "Deploying to Netlify..."
netlify deploy --prod --dir=build

echo "✅ Frontend deployed successfully!"

cd ..
```

## Full Stack Deploy (Both)

### Windows (PowerShell)
Save as `deploy-all.ps1`:
```powershell
Write-Host "🚀 Full Stack Deployment" -ForegroundColor Cyan

# Deploy Backend
.\deploy-backend.ps1

# Get the deployed API URL
$apiUrl = Read-Host "Enter the deployed backend URL (from above)"

# Deploy Frontend with backend URL
cd frontend
Write-Host "Deploying frontend with API URL: $apiUrl" -ForegroundColor Green

@"
REACT_APP_API_URL=$apiUrl
"@ | Out-File -FilePath .env.production -Encoding utf8

npm run build
netlify deploy --prod --dir=build

cd ..

Write-Host "✅ Full stack deployed successfully!" -ForegroundColor Green
```

### Linux/Mac (Bash)
Save as `deploy-all.sh`:
```bash
#!/bin/bash

echo "🚀 Full Stack Deployment"

# Deploy Backend
./deploy-backend.sh

# Get the deployed API URL
read -p "Enter the deployed backend URL (from above): " apiUrl

# Deploy Frontend with backend URL
cd frontend
echo "Deploying frontend with API URL: $apiUrl"

cat > .env.production << EOF
REACT_APP_API_URL=$apiUrl
EOF

npm run build
netlify deploy --prod --dir=build

cd ..

echo "✅ Full stack deployed successfully!"
```

## Usage

### Windows
```powershell
# Make scripts executable and run
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

# Deploy backend only
.\deploy-backend.ps1

# Deploy frontend only
.\deploy-frontend.ps1

# Deploy both
.\deploy-all.ps1
```

### Linux/Mac
```bash
# Make scripts executable
chmod +x deploy-backend.sh deploy-frontend.sh deploy-all.sh

# Deploy backend only
./deploy-backend.sh

# Deploy frontend only
./deploy-frontend.sh

# Deploy both
./deploy-all.sh
```

## Environment Variables Checklist

### Backend (Heroku)
- ✅ DATABASE_URL (auto-set by Heroku Postgres)
- ✅ JWT_SECRET (set during deploy)
- ✅ NODE_ENV=production
- ✅ FRONTEND_URL (your Netlify URL)

### Frontend (Netlify)
- ✅ REACT_APP_API_URL (your Heroku API URL)

## Post-Deployment

### Verify Backend
```bash
curl https://your-app.herokuapp.com/api/tables
```

### Verify Frontend
Open browser: `https://your-app.netlify.app`

### Check Logs
```bash
# Backend logs
heroku logs --tail -a your-app

# Frontend logs  
netlify logs
```
