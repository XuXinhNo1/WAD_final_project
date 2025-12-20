# Deployment Guide

## Overview
This guide covers deploying the backend to Heroku and the frontend to Netlify.

## Prerequisites
- Heroku account and Heroku CLI installed
- Netlify account
- Git repository
- PostgreSQL database (Heroku Postgres or external)

---

## Backend Deployment (Heroku)

### Step 1: Install Heroku CLI
```bash
# Download from https://devcenter.heroku.com/articles/heroku-cli
# Or use npm
npm install -g heroku
```

### Step 2: Login to Heroku
```bash
heroku login
```

### Step 3: Create Heroku App
```bash
cd backend
heroku create your-restaurant-api
```

### Step 4: Add PostgreSQL Database
```bash
heroku addons:create heroku-postgresql:mini
```

This automatically sets the `DATABASE_URL` environment variable.

### Step 5: Set Environment Variables
```bash
heroku config:set JWT_SECRET="your-super-secret-jwt-key-change-this"
heroku config:set NODE_ENV=production
heroku config:set FRONTEND_URL="https://your-restaurant-app.netlify.app"
```

### Step 6: Verify Configuration
```bash
heroku config
```

You should see:
```
DATABASE_URL: postgres://...
JWT_SECRET: your-super-secret-jwt-key-change-this
NODE_ENV: production
FRONTEND_URL: https://your-restaurant-app.netlify.app
```

### Step 7: Deploy Backend
```bash
# From the root directory
git subtree push --prefix backend heroku main

# Or if you're in the backend directory
git push heroku main
```

### Step 8: Run Database Migrations
```bash
heroku run npx prisma migrate deploy
heroku run npx prisma generate
```

### Step 9: Seed Database (Optional)
```bash
heroku run npm run db:seed
```

### Step 10: Check Logs
```bash
heroku logs --tail
```

### Step 11: Open Your API
```bash
heroku open
```

Your API will be available at: `https://your-restaurant-api.herokuapp.com/api`

---

## Frontend Deployment (Netlify)

### Option 1: Deploy via Netlify CLI

#### Step 1: Install Netlify CLI
```bash
npm install -g netlify-cli
```

#### Step 2: Login to Netlify
```bash
netlify login
```

#### Step 3: Initialize Netlify
```bash
cd frontend
netlify init
```

Follow the prompts:
- Create & configure a new site
- Choose your team
- Site name: `your-restaurant-app`
- Build command: `npm run build`
- Publish directory: `build`

#### Step 4: Set Environment Variables
```bash
netlify env:set REACT_APP_API_URL "https://your-restaurant-api.herokuapp.com/api"
```

#### Step 5: Build and Deploy
```bash
npm run build
netlify deploy --prod
```

### Option 2: Deploy via Netlify Dashboard

#### Step 1: Push Code to Git
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

#### Step 2: Connect to Netlify
1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Click "Add new site" → "Import an existing project"
3. Choose your Git provider (GitHub, GitLab, Bitbucket)
4. Select your repository

#### Step 3: Configure Build Settings
- **Base directory**: `frontend`
- **Build command**: `npm run build`
- **Publish directory**: `frontend/build`

#### Step 4: Set Environment Variables
In Netlify Dashboard:
1. Go to Site settings → Build & deploy → Environment
2. Add environment variable:
   - Key: `REACT_APP_API_URL`
   - Value: `https://your-restaurant-api.herokuapp.com/api`

#### Step 5: Deploy
Click "Deploy site"

---

## Verification

### Test Backend API
```bash
curl https://your-restaurant-api.herokuapp.com/api/tables
```

### Test Frontend
Open your browser:
```
https://your-restaurant-app.netlify.app
```

---

## Custom Domains (Optional)

### Heroku Custom Domain
```bash
heroku domains:add api.yourrestaurant.com
```

Follow Heroku's instructions to configure your DNS.

### Netlify Custom Domain
1. Go to Netlify Dashboard → Domain settings
2. Add custom domain
3. Follow instructions to configure DNS

---

## Environment Variables Summary

### Backend (Heroku)
```
DATABASE_URL=postgresql://...  (auto-set by Heroku Postgres)
JWT_SECRET=your-secret-key
NODE_ENV=production
FRONTEND_URL=https://your-restaurant-app.netlify.app
PORT=<auto-set by Heroku>
```

### Frontend (Netlify)
```
REACT_APP_API_URL=https://your-restaurant-api.herokuapp.com/api
```

---

## Continuous Deployment

### Auto-Deploy from Git

#### Heroku
1. Connect GitHub repo in Heroku Dashboard
2. Enable automatic deploys from main branch

#### Netlify
Netlify automatically deploys when you push to connected Git branch.

---

## Troubleshooting

### Backend Issues

#### Error: "Cannot find module"
```bash
# Clear cache and rebuild
heroku repo:purge_cache
git commit --allow-empty -m "Rebuild"
git push heroku main
```

#### Database Connection Error
```bash
# Check DATABASE_URL is set
heroku config:get DATABASE_URL

# Run migrations
heroku run npx prisma migrate deploy
```

#### Application Crash
```bash
# Check logs
heroku logs --tail

# Restart dynos
heroku restart
```

### Frontend Issues

#### API Connection Failed
- Verify `REACT_APP_API_URL` is set correctly
- Check CORS settings in backend
- Ensure backend is running

#### Build Failed
```bash
# Clear cache
netlify build --clear-cache

# Check build logs in Netlify Dashboard
```

#### Environment Variable Not Working
- Ensure variable starts with `REACT_APP_`
- Rebuild site after setting variables
- Check browser console for actual API URL being used

---

## Monitoring

### Heroku
- View metrics: `heroku logs --tail`
- Monitor dyno usage in Dashboard
- Set up log drains for persistent logs

### Netlify
- Check deploy logs in Dashboard
- Monitor bandwidth and build minutes
- Set up deploy notifications

---

## Scaling

### Heroku
```bash
# Scale to multiple dynos
heroku ps:scale web=2

# Upgrade dyno type
heroku ps:type worker=standard-1x
```

### Netlify
- Automatically scales
- Upgrade plan for more bandwidth/build minutes

---

## Backup Strategy

### Database Backup (Heroku)
```bash
# Manual backup
heroku pg:backups:capture

# Schedule automatic backups
heroku pg:backups:schedule --at '02:00 America/Los_Angeles'

# Download backup
heroku pg:backups:download
```

---

## Security Checklist

- [ ] Change default JWT_SECRET
- [ ] Enable HTTPS only
- [ ] Set secure CORS origins
- [ ] Use environment variables for all secrets
- [ ] Enable rate limiting
- [ ] Keep dependencies updated
- [ ] Monitor error logs
- [ ] Set up database backups

---

## Cost Estimation

### Heroku (Free/Hobby Tier)
- Eco Dyno: $5/month
- Mini Postgres: $5/month
- **Total**: ~$10/month

### Netlify (Free Tier)
- 100GB bandwidth/month
- 300 build minutes/month
- **Cost**: $0 for small projects

---

## Useful Commands

### Heroku
```bash
# View logs
heroku logs --tail

# Run commands
heroku run npm run db:seed

# Database console
heroku pg:psql

# Restart app
heroku restart

# Check dyno status
heroku ps
```

### Netlify
```bash
# Deploy preview
netlify deploy

# Deploy to production
netlify deploy --prod

# View site info
netlify status

# Open site
netlify open
```

---

## Support Resources

- [Heroku Dev Center](https://devcenter.heroku.com/)
- [Netlify Docs](https://docs.netlify.com/)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)
- [NestJS Deployment](https://docs.nestjs.com/deployment)
