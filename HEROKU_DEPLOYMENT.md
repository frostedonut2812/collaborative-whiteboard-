# Heroku Deployment Guide - Collaborative Whiteboard

## Prerequisites

1. **Heroku CLI** - Install from https://devcenter.heroku.com/articles/heroku-cli
2. **Git** - Already initialized ✅
3. **Heroku Account** - Sign up at https://heroku.com

## Step-by-Step Deployment

### 1. Install Heroku CLI (if not already installed)

**macOS:**
```bash
brew tap heroku/brew && brew install heroku
```

**Windows:**
Download from: https://devcenter.heroku.com/articles/heroku-cli

**Linux:**
```bash
curl https://cli-assets.heroku.com/install.sh | sh
```

### 2. Login to Heroku
```bash
heroku login
```
This will open your browser to complete authentication.

### 3. Create Heroku Application
```bash
# Replace 'your-whiteboard-app' with your desired app name
heroku create your-whiteboard-app
```

**Note:** App names must be unique across all Heroku. If taken, try:
- `your-name-whiteboard`
- `collaborative-board-2024`
- `team-whiteboard-app`

### 4. Set Environment Variables
```bash
heroku config:set NODE_ENV=production
heroku config:set NPM_CONFIG_PRODUCTION=false
```

### 5. Add and Commit Files
```bash
git add .
git commit -m "Initial commit - Collaborative Whiteboard"
```

### 6. Deploy to Heroku
```bash
git push heroku master
```

### 7. Open Your Application
```bash
heroku open
```

## Your App URLs

After deployment, your app will be available at:
- **Production URL:** `https://your-app-name.herokuapp.com`
- **Heroku Dashboard:** `https://dashboard.heroku.com/apps/your-app-name`

## Post-Deployment Verification

1. **Test Real-time Features:**
   - Open multiple browser tabs
   - Test drawing synchronization
   - Verify room functionality
   - Check user count updates

2. **Test Mobile Responsiveness:**
   - Open on mobile device
   - Test touch drawing
   - Verify responsive design

## Heroku Configuration Details

### Procfile
```
web: npm start
```

### Build Process
Heroku automatically runs:
1. `npm install` (installs backend dependencies)
2. `npm run heroku-postbuild` (builds React app)
3. `npm start` (starts the server)

### Environment Variables Set
- `NODE_ENV=production`
- `NPM_CONFIG_PRODUCTION=false` (allows devDependencies for React build)

## Troubleshooting

### Common Issues

#### 1. Build Fails
```bash
# Check build logs
heroku logs --tail

# Common fix: Clear cache and rebuild
heroku plugins:install heroku-repo
heroku repo:purge_cache -a your-app-name
git commit --allow-empty -m "Rebuild"
git push heroku master
```

#### 2. App Crashes
```bash
# Check application logs
heroku logs --tail

# Restart the app
heroku restart
```

#### 3. Socket.io Connection Issues
- Ensure CORS is configured for your Heroku domain
- Check that WebSocket connections are allowed

### Useful Heroku Commands

```bash
# View logs
heroku logs --tail

# Restart app
heroku restart

# Check app status
heroku ps

# Open app in browser
heroku open

# View config variables
heroku config

# Scale dynos (if needed)
heroku ps:scale web=1
```

## Monitoring & Maintenance

### Performance Monitoring
```bash
# View app metrics
heroku logs --tail | grep "heroku/router"
```

### Updating Your App
```bash
# Make changes to your code
git add .
git commit -m "Update: description of changes"
git push heroku master
```

## Cost Information

- **Free Tier:** Available with limitations (sleeps after 30 min of inactivity)
- **Hobby Tier:** $7/month (always on, custom domains)
- **Production Tier:** $25+/month (enhanced performance, metrics)

## Security Considerations

1. **Environment Variables:** Never commit sensitive data to Git
2. **HTTPS:** Heroku provides SSL certificates automatically
3. **Rate Limiting:** Consider adding rate limiting for production use

## Next Steps After Deployment

1. **Custom Domain:** Add your own domain name
2. **Monitoring:** Set up application monitoring
3. **Database:** Add persistent storage if needed
4. **CDN:** Consider CloudFlare for global performance

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Heroku logs: `heroku logs --tail`
3. Consult Heroku documentation: https://devcenter.heroku.com/
