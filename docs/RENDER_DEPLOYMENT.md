# Deploying to Render.com - Complete Guide

## Repository Structure

Your monorepo should look like this:

```
flashcard/
├── app.js                 # Frontend app
├── index.html             # Frontend HTML
├── styles.css             # Frontend styles
├── package.json           # Root package.json (updated for monorepo)
├── render.yaml            # Render deployment config
├── .gitignore
├── backend/
│   ├── server.js          # Backend Express app
│   ├── config.json        # Backend configuration
│   ├── package.json       # Backend dependencies
│   ├── .env.example       # Environment template
│   └── README.md          # Backend documentation
├── www/                   # Static files (optional)
├── fonts/
├── icons/
└── pdfs/
```

## Step 1: Prepare Your Repository

### Update .gitignore

Create or update `.gitignore` in the root:

```
# Dependencies
node_modules/
backend/node_modules/

# Environment
.env
.env.local
.env.*.local

# Logs
*.log
npm-debug.log*

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/

# Build
dist/
build/

# Capacitor
android/
```

### Create Backend .env.example

Make sure your `backend/.env.example` exists:

```env
GROQ_API_KEY=your_groq_api_key_here
PORT=5000
NODE_ENV=production
```

## Step 2: Update Backend Config for Render

Edit `backend/config.json` to use environment variables:

```json
{
  "port": 5000,
  "environment": "production",
  "cors": {
    "origin": "*",
    "credentials": true
  },
  // ... rest of config
}
```

The backend will automatically use `process.env.PORT` if set.

## Step 3: Update Frontend to Use Dynamic Backend URL

Update `app.js` to detect the backend URL:

Replace this:
```javascript
const PDFbackendUrl = localStorage.getItem('PDFbackendUrl') || 'https://flashcard-api-o5a7.onrender.com';
```

With this:
```javascript
function getPDFBackendUrl() {
  // In production on Render, use relative path
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return window.location.origin; // Backend runs on same domain
  }
  // In development, use stored URL or default
  return localStorage.getItem('PDFbackendUrl') || 'http://localhost:5000';
}

const PDFbackendUrl = getPDFBackendUrl();
```

Also update the main backend URL:
```javascript
function getBackendUrl() {
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return window.location.origin; // Backend runs on same domain
  }
  return localStorage.getItem('backendUrl') || 'http://localhost:5000';
}
```

## Step 4: Deploy to Render

### Option A: Using Render Dashboard (Recommended for First Time)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

2. **Go to [render.com](https://render.com)**
   - Sign up or login
   - Click "New +"
   - Select "Web Service"

3. **Connect GitHub Repository**:
   - Click "Connect a repository"
   - Select your flashcard repository
   - Click "Deploy"

4. **Configure the Service**:
   - **Name**: `flashcard-api` (or your preferred name)
   - **Runtime**: `Node`
   - **Build Command**: 
     ```
     npm install && cd backend && npm install --production
     ```
   - **Start Command**: 
     ```
     npm start
     ```
   - **Plan**: Free (or Starter if you want better performance)

5. **Add Environment Variables**:
   - Click "Environment"
   - Add variable: `GROQ_API_KEY` = your actual Groq API key
   - Add variable: `NODE_ENV` = `production`

6. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment to complete (2-3 minutes)

### Option B: Using render.yaml (Automated)

1. **Ensure render.yaml exists in root** (already created)

2. **Push to GitHub**:
   ```bash
   git add render.yaml
   git commit -m "Add Render config"
   git push origin main
   ```

3. **On Render Dashboard**:
   - Click "New +"
   - Select "YAML"
   - Point to your repository's `render.yaml`
   - Add `GROQ_API_KEY` environment variable
   - Click "Deploy"

## Step 5: Verify Deployment

Once deployed on Render:

1. **Check Backend Health**:
   - Visit `https://your-service-name.onrender.com/api/health`
   - Should return JSON with status "OK"

2. **Test from Frontend**:
   - Visit your Render URL
   - Try generating a quiz from a PDF
   - Check browser console for errors

3. **Common Issues**:
   - **CORS errors**: Ensure backend CORS is set to allow requests
   - **PDF upload fails**: Check file size limits in config.json
   - **API key not found**: Verify GROQ_API_KEY is set in Render environment

## Step 6: Connect Frontend to Backend

Once backend is deployed at `https://your-service-name.onrender.com`:

### Option 1: Same Service (Recommended)
Backend and frontend run on the same Render URL. No configuration needed if you're using the dynamic URL function above.

### Option 2: Separate Service
If frontend and backend are separate services:

1. Get your backend URL from Render
2. Update frontend code:
   ```javascript
   function getBackendUrl() {
     return 'https://flashcard-backend.onrender.com'; // Your actual backend URL
   }
   ```

Or use localStorage:
```javascript
function setBackendUrl(url) {
  localStorage.setItem('backendUrl', url.replace(/\/$/, ''));
  toast(`✅ Backend URL set to: ${url}`);
}
```

## Step 7: Continuous Deployment

Once connected to GitHub:
- Every push to your main branch automatically deploys
- Render shows deployment logs in real-time
- Automatic rollback available if needed

## Troubleshooting

### Deployment Fails with "Cannot find module"

**Solution**: Your `backend/package.json` might be missing dependencies.

Check and reinstall:
```bash
cd backend
npm install
```

### Backend returns 404 on /api routes

**Solution**: Ensure `npm start` is running the backend server correctly.

Check logs in Render dashboard for startup errors.

### CORS errors when calling API from frontend

**Solution**: Update `backend/config.json`:
```json
{
  "cors": {
    "origin": ["https://your-domain.onrender.com", "http://localhost:3000"],
    "credentials": true
  }
}
```

### Environment variable not found at runtime

**Solution**: 
1. Verify variable exists in Render dashboard
2. For secret keys, use "Secret" variable type
3. Redeploy after adding variables

## File Paths for Render

When deployed on Render as a single service:

```
https://your-service.onrender.com/              → Frontend (app.js served)
https://your-service.onrender.com/api/health    → Backend health check
https://your-service.onrender.com/api/generate-quiz-from-document → PDF quiz endpoint
```

## Performance Tips

1. **Use Free Plan** initially to test
2. **Upgrade to Starter** ($7/month) for:
   - Always-on service (no spin-down)
   - Better performance
   - More RAM

3. **Optimize PDF uploads**:
   - Limit file size in config.json
   - Consider file compression on frontend

4. **Cache responses** in frontend:
   - Store generated quizzes in localStorage
   - Reduce API calls

## Security Best Practices

1. ✅ Never commit `.env` file
2. ✅ Use environment variables for secrets
3. ✅ Update GROQ_API_KEY if exposed
4. ✅ Use HTTPS only (Render provides this automatically)
5. ✅ Validate file uploads on backend
6. ✅ Limit CORS to trusted domains in production

## Next Steps

1. Push code to GitHub
2. Deploy via Render dashboard
3. Add GROQ_API_KEY environment variable
4. Test API endpoints
5. Update frontend base URL if needed
6. Monitor logs and performance

## Useful Commands

```bash
# Local testing before deployment
npm start

# Install all dependencies
npm run install-all

# Check backend alone
cd backend && npm start

# View Render logs
# Go to Render dashboard → Your Service → Logs
```

## Support

- Render docs: https://render.com/docs
- Groq API docs: https://console.groq.com/docs
- Express docs: https://expressjs.com
