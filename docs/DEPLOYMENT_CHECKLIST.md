# Deployment Checklist

## Pre-Deployment Preparation

### General
- [ ] Code is committed to Git
- [ ] All tests pass locally
- [ ] No hardcoded secrets or API keys in code
- [ ] `.env` files are in `.gitignore`
- [ ] Dependencies are up to date

### Backend Preparation
- [ ] `Procfile` exists in backend/
- [ ] `.env.example` exists with all required variables
- [ ] Database migrations are ready
- [ ] Seed data is prepared (optional)
- [ ] TypeScript compiles without errors (`npm run build`)
- [ ] CORS settings allow frontend origin
- [ ] All environment variables documented

### Frontend Preparation
- [ ] `netlify.toml` exists in frontend/
- [ ] `.env.example` exists
- [ ] API URL is configurable via environment variable
- [ ] Build completes successfully (`npm run build`)
- [ ] No console errors in production build
- [ ] Assets are optimized

---

## Backend Deployment (Heroku)

### Account Setup
- [ ] Heroku account created
- [ ] Heroku CLI installed (`heroku --version`)
- [ ] Logged in to Heroku (`heroku login`)
- [ ] Credit card added (required for addons, even free tier)

### App Creation
- [ ] Heroku app created (`heroku create app-name`)
- [ ] PostgreSQL addon added (`heroku addons:create heroku-postgresql:mini`)
- [ ] App name noted: `___________________________`

### Environment Configuration
- [ ] `DATABASE_URL` set (auto-set by Postgres addon)
- [ ] `JWT_SECRET` set (strong random key)
- [ ] `NODE_ENV` set to `production`
- [ ] `FRONTEND_URL` set to Netlify URL
- [ ] All variables verified (`heroku config`)

### Deployment
- [ ] Code pushed to Heroku (`git push heroku main`)
- [ ] Build completed successfully
- [ ] No build errors in logs
- [ ] Migrations deployed (`heroku run npx prisma migrate deploy`)
- [ ] Prisma generated (`heroku run npx prisma generate`)
- [ ] Database seeded (optional: `heroku run npm run db:seed`)

### Verification
- [ ] App is running (`heroku ps`)
- [ ] Logs show no errors (`heroku logs --tail`)
- [ ] API endpoint responds: `curl https://your-app.herokuapp.com/api/tables`
- [ ] Database has tables and data
- [ ] API URL noted: `___________________________`

---

## Frontend Deployment (Netlify)

### Account Setup
- [ ] Netlify account created
- [ ] Netlify CLI installed (`npm install -g netlify-cli`)
- [ ] Logged in to Netlify (`netlify login`)

### Configuration
- [ ] Create `.env.production` file in frontend/
- [ ] Set `REACT_APP_API_URL` to Heroku backend URL
- [ ] `netlify.toml` configured correctly
- [ ] Build directory set to `build`

### Deployment Method Chosen
Choose one:
- [ ] **Option A**: Deploy via Netlify CLI
- [ ] **Option B**: Deploy via Netlify Dashboard (connected to Git)

### Option A: CLI Deployment
- [ ] Site initialized (`netlify init`)
- [ ] Environment variables set (`netlify env:set REACT_APP_API_URL "..."`)
- [ ] Build completed (`npm run build`)
- [ ] Deployed (`netlify deploy --prod --dir=build`)

### Option B: Dashboard Deployment
- [ ] Repository connected to Netlify
- [ ] Build settings configured:
  - Base directory: `frontend`
  - Build command: `npm run build`
  - Publish directory: `frontend/build`
- [ ] Environment variables set in dashboard
- [ ] First deployment triggered

### Verification
- [ ] Site is live and accessible
- [ ] No console errors in browser
- [ ] API calls work (check Network tab)
- [ ] Tables page loads data
- [ ] Create/Edit/Delete operations work
- [ ] QR codes generate correctly
- [ ] Frontend URL noted: `___________________________`

---

## Integration Testing

### Backend Tests
- [ ] Health check: `curl https://your-api.herokuapp.com/api/tables`
- [ ] GET all tables returns data
- [ ] POST create table works
- [ ] PUT update table works
- [ ] PATCH status update works
- [ ] DELETE table works
- [ ] QR generation works
- [ ] Token verification works

### Frontend Tests
- [ ] Home page loads
- [ ] Tables page displays data
- [ ] Can create new table
- [ ] Can edit existing table
- [ ] Can change table status
- [ ] Can delete table
- [ ] QR modal opens
- [ ] QR code displays
- [ ] Download QR works
- [ ] Responsive design works on mobile

### Cross-Origin Tests
- [ ] No CORS errors in console
- [ ] API calls from frontend succeed
- [ ] Images/assets load correctly
- [ ] Authentication works (if implemented)

---

## Security Checklist

- [ ] JWT_SECRET is strong (32+ characters)
- [ ] Database credentials not exposed
- [ ] HTTPS enabled (automatic on Heroku/Netlify)
- [ ] CORS restricted to frontend origin only
- [ ] Input validation working
- [ ] SQL injection prevention (Prisma handles this)
- [ ] XSS prevention in place
- [ ] Rate limiting considered (if high traffic expected)

---

## Performance Optimization

### Backend
- [ ] Database indices created for frequently queried fields
- [ ] Prisma queries optimized
- [ ] Response compression enabled
- [ ] Connection pooling configured

### Frontend
- [ ] Code splitting enabled
- [ ] Images optimized
- [ ] Lazy loading for routes
- [ ] Service worker configured (optional)
- [ ] Lighthouse score checked

---

## Monitoring & Maintenance

### Setup Monitoring
- [ ] Heroku logs monitored (`heroku logs --tail`)
- [ ] Netlify deploy notifications enabled
- [ ] Error tracking setup (e.g., Sentry) - optional
- [ ] Uptime monitoring setup (e.g., UptimeRobot) - optional

### Backup Strategy
- [ ] Database backup schedule configured
- [ ] Know how to restore from backup
- [ ] Code backed up in Git repository
- [ ] Environment variables documented

### Maintenance Plan
- [ ] Update schedule planned (security patches)
- [ ] Dependency update process defined
- [ ] Rollback plan documented
- [ ] Support contact information ready

---

## Documentation

- [ ] Deployment guide updated
- [ ] API documentation current
- [ ] Environment variables documented
- [ ] README updated with live URLs
- [ ] Architecture diagram created (optional)

---

## Post-Deployment

### Share Your Work
- [ ] Live URL shared with team/instructor
- [ ] Demo video recorded (optional)
- [ ] Screenshots captured
- [ ] Project added to portfolio

### URLs to Share
```
Backend API:  https://___________________________
Frontend App: https://___________________________
GitHub Repo:  https://___________________________
```

### Known Issues
Document any issues or limitations:
```
1. _________________________________________________
2. _________________________________________________
3. _________________________________________________
```

### Future Improvements
```
1. _________________________________________________
2. _________________________________________________
3. _________________________________________________
```

---

## Troubleshooting Reference

### Common Issues

**Backend won't start**
- Check logs: `heroku logs --tail`
- Verify DATABASE_URL: `heroku config:get DATABASE_URL`
- Restart: `heroku restart`

**Frontend can't connect to API**
- Check CORS settings in backend
- Verify API URL in frontend env vars
- Check browser console for errors

**Database migration failed**
- Check migration files
- Run manually: `heroku run npx prisma migrate deploy`
- Check Prisma schema syntax

**Build failed**
- Check package.json scripts
- Verify all dependencies installed
- Clear cache: `heroku repo:purge_cache`

---

## Sign-Off

Deployment completed by: ____________________

Date: ____________________

Deployed URLs:
- Backend: ____________________
- Frontend: ____________________

Status: [ ] Success  [ ] Issues (see notes)

Notes:
_____________________________________________________________
_____________________________________________________________
_____________________________________________________________
