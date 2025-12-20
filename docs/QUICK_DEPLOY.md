# Quick Deployment Reference Card

## 🎯 Deploy in 10 Minutes

### Prerequisites
```bash
# Install tools
npm install -g heroku netlify-cli

# Login
heroku login
netlify login
```

### Backend → Heroku (5 minutes)
```bash
cd backend

# Create & configure
heroku create your-api-name
heroku addons:create heroku-postgresql:mini
heroku config:set JWT_SECRET="$(openssl rand -base64 32)"
heroku config:set NODE_ENV=production
heroku config:set FRONTEND_URL="https://your-app.netlify.app"

# Deploy
git push heroku main
heroku run npx prisma migrate deploy

# Get URL
heroku open
# API URL: https://your-api-name.herokuapp.com/api
```

### Frontend → Netlify (5 minutes)
```bash
cd frontend

# Configure
echo 'REACT_APP_API_URL=https://your-api-name.herokuapp.com/api' > .env.production

# Deploy
npm run build
netlify deploy --prod --dir=build

# Site URL shown in output
```

### Verify
```bash
# Test backend
curl https://your-api-name.herokuapp.com/api/tables

# Open frontend
# Visit: https://your-app-name.netlify.app
```

---

## 📝 Environment Variables

### Backend
| Variable | Value | Where |
|----------|-------|-------|
| DATABASE_URL | Auto-set | Heroku Postgres |
| JWT_SECRET | Random 32+ chars | `heroku config:set` |
| NODE_ENV | `production` | `heroku config:set` |
| FRONTEND_URL | Your Netlify URL | `heroku config:set` |

### Frontend
| Variable | Value | Where |
|----------|-------|-------|
| REACT_APP_API_URL | Your Heroku API URL | Netlify dashboard or CLI |

---

## 🔧 Common Commands

### Heroku
```bash
heroku logs --tail              # View logs
heroku ps                       # Check dyno status
heroku restart                  # Restart app
heroku run npx prisma studio    # Database GUI
heroku pg:backups:capture       # Backup database
heroku config                   # View all env vars
```

### Netlify
```bash
netlify status                  # Site info
netlify logs                    # View logs
netlify open                    # Open dashboard
netlify deploy --prod          # Deploy
```

---

## 🚨 Troubleshooting

### Backend won't start
```bash
heroku logs --tail              # Check errors
heroku restart                  # Restart
heroku config                   # Verify env vars
```

### Frontend can't connect
1. Check `REACT_APP_API_URL` is set
2. Check CORS in backend allows your Netlify domain
3. Check browser console for errors

### Database issues
```bash
heroku pg:info                  # Database status
heroku run npx prisma migrate deploy  # Run migrations
heroku run npx prisma generate  # Generate Prisma client
```

---

## 📊 Cost Summary

| Service | Plan | Cost |
|---------|------|------|
| Heroku Eco Dyno | Eco | $5/mo |
| Heroku Postgres | Mini | $5/mo |
| Netlify | Free | $0 |
| **Total** | | **$10/mo** |

---

## ✅ Deployment Checklist

**Before Deploy:**
- [ ] Code committed to Git
- [ ] `.env` files in `.gitignore`
- [ ] Tests pass locally
- [ ] Heroku & Netlify accounts created

**Backend:**
- [ ] App created on Heroku
- [ ] PostgreSQL addon added
- [ ] Environment variables set
- [ ] Code deployed
- [ ] Migrations run
- [ ] API responding

**Frontend:**
- [ ] Build succeeds locally
- [ ] API URL configured
- [ ] Deployed to Netlify
- [ ] Site accessible
- [ ] Can connect to API

**Integration:**
- [ ] Create table works
- [ ] Update table works
- [ ] Delete table works
- [ ] QR codes generate
- [ ] All features working

---

## 🔗 Quick Links

- [Complete Guide](DEPLOYMENT.md)
- [Deployment Scripts](DEPLOYMENT_SCRIPTS.md)
- [Full Checklist](DEPLOYMENT_CHECKLIST.md)
- [Setup Summary](DEPLOYMENT_SETUP_SUMMARY.md)

---

## 💡 Pro Tips

1. **Use strong secrets**: `openssl rand -base64 32`
2. **Test locally first**: Ensure everything works
3. **Monitor logs**: `heroku logs --tail`
4. **Backup database**: `heroku pg:backups:capture`
5. **Custom domains**: Add after initial deployment works

---

## 🎉 Success Criteria

✅ Backend API accessible at `https://your-app.herokuapp.com/api`  
✅ Frontend app accessible at `https://your-app.netlify.app`  
✅ Can create/edit/delete tables  
✅ QR codes generate and download  
✅ No errors in logs or console  

---

**Need help?** Check the full guides in the `docs/` folder!
