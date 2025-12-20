# Restaurant Table Management - Production Environment

## Live URLs
- **Backend API**: https://your-restaurant-api.herokuapp.com/api
- **Frontend App**: https://your-restaurant-app.netlify.app

## Environment Setup

### Backend (Heroku)
```bash
heroku config:set JWT_SECRET="your-production-secret-key-here"
heroku config:set NODE_ENV=production
heroku config:set FRONTEND_URL="https://your-restaurant-app.netlify.app"
```

### Frontend (Netlify)
Set in Netlify Dashboard or via CLI:
```bash
netlify env:set REACT_APP_API_URL "https://your-restaurant-api.herokuapp.com/api"
```

## Deployment Status
- [ ] Backend deployed to Heroku
- [ ] Database migrations applied
- [ ] Frontend deployed to Netlify
- [ ] Environment variables configured
- [ ] Integration testing completed
- [ ] Security checklist reviewed

## Quick Commands

### View Backend Logs
```bash
heroku logs --tail -a your-restaurant-api
```

### Redeploy Frontend
```bash
cd frontend
npm run build
netlify deploy --prod --dir=build
```

### Database Operations
```bash
# Backup database
heroku pg:backups:capture -a your-restaurant-api

# Download backup
heroku pg:backups:download -a your-restaurant-api

# Restore from backup
heroku pg:backups:restore -a your-restaurant-api

# Access database console
heroku pg:psql -a your-restaurant-api
```

## Monitoring
- Heroku Dashboard: https://dashboard.heroku.com/
- Netlify Dashboard: https://app.netlify.com/
- Database: Heroku Postgres Dashboard

## Support
For issues, check:
1. [Deployment Checklist](DEPLOYMENT_CHECKLIST.md)
2. [Deployment Guide](DEPLOYMENT.md)
3. Heroku logs: `heroku logs --tail`
4. Browser console for frontend errors

## Last Updated
Date: _______________
By: _______________
