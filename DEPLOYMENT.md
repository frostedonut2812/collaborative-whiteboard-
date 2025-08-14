# Deployment Guide - Collaborative Whiteboard

## Quick Deploy Options

### 1. Heroku (Recommended for Beginners)

```bash
# Install Heroku CLI
npm install -g heroku

# Login and create app
heroku login
heroku create your-whiteboard-name

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set FRONTEND_URL=https://your-whiteboard-name.herokuapp.com

# Deploy
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### 2. Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy
railway login
railway link
railway up
```

### 3. Render

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set build command: `npm install && cd client && npm install && npm run build`
4. Set start command: `npm start`
5. Add environment variable: `NODE_ENV=production`

### 4. DigitalOcean App Platform

1. Connect your GitHub repository
2. DigitalOcean will auto-detect the Node.js app
3. Set environment variables in the dashboard

## Environment Variables

Create a `.env` file for production:

```
NODE_ENV=production
PORT=5001
FRONTEND_URL=https://your-deployed-url.com
```

## Pre-Deployment Checklist

- [x] Production-ready CORS configuration
- [x] Environment-based Socket.io URLs
- [x] Build scripts configured
- [x] Static file serving for production
- [x] Process management ready

## Local Production Test

```bash
# Build the React app
cd client && npm run build && cd ..

# Set production environment
export NODE_ENV=production

# Start the server
npm start
```

## Post-Deployment

1. Test real-time collaboration with multiple users
2. Verify room functionality works across different sessions
3. Check that drawing synchronization works properly
4. Test on mobile devices

## Scaling Considerations

For high-traffic deployments, consider:
- Redis adapter for Socket.io clustering
- Database for persistent room storage
- CDN for static assets
- Load balancer for multiple instances

## Support

Your collaborative whiteboard includes:
- Real-time multi-user drawing
- Room-based collaboration
- Mobile-responsive design
- Production-ready configuration
