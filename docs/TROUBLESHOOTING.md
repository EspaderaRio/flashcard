# 🔧 Troubleshooting Guide

## Common Issues & Solutions

### 1. Build Fails on Render

**Error**: `npm ERR! code ENOENT` or `Cannot find module`

**Solutions**:
```bash
# Ensure backend/package.json exists and is valid
cd backend && npm install --production

# Check for typos in build command
# Should be: npm install && cd backend && npm install --production

# Verify all files are committed
git status
git add .
git commit -m "Fix"
git push
```

**Render Settings Check**:
- Build Command: `npm install && cd backend && npm install --production`
- Start Command: `npm start`

---

### 2. "GROQ_API_KEY is not configured"

**Problem**: Backend can't find the API key

**Solution**:
1. Get your key from https://console.groq.com
2. In Render dashboard: Click your service → Environment
3. Click "Add Environment Variable"
4. Key: `GROQ_API_KEY`
5. Value: [paste your actual key]
6. Click "Save Changes"
7. **Important**: Service automatically redeploys

**Verify**:
```bash
# In Render logs, you should see:
# ⚠️  If you see "not configured", the variable wasn't saved
```

---

### 3. API Returns 404

**Problem**: `/api/health` or `/api/generate-quiz-from-document` returns 404

**Solution**:
1. Check Render logs for startup errors
2. Verify `backend/server.js` exists and is valid
3. Ensure build command completed successfully
4. Look for error messages in red text in logs

**Test**:
```
GET https://your-service.onrender.com/api/health
```

Should return:
```json
{
  "status": "OK",
  "timestamp": "...",
  "version": "2.0.0"
}
```

---

### 4. CORS Errors in Browser Console

**Error**: `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution**: This shouldn't happen with current setup, but if it does:

Edit `backend/config.json`:
```json
{
  "cors": {
    "origin": "*",
    "credentials": true
  }
}
```

Or be more specific:
```json
{
  "cors": {
    "origin": [
      "https://your-service.onrender.com",
      "http://localhost:5000"
    ],
    "credentials": true
  }
}
```

---

### 5. PDF Upload Fails / Times Out

**Problem**: File upload hangs or returns error

**Causes & Solutions**:

**Size Issue**:
- Check `backend/config.json` `maxFileSize` (default: 10MB)
- Try a smaller PDF
- Browser max upload: 50MB (in backend/server.js middleware)

**Timeout Issue**:
- Free tier Render instances are slow
- Upgrade to Starter plan ($7/month)
- Or reduce document size

**API Key Issue**:
- Verify GROQ_API_KEY is set
- Check Groq quota isn't exceeded at console.groq.com

---

### 6. "Generated questions contain placeholder options"

**Problem**: Backend returns low-quality quiz options

**Causes**:
- Document is too short or low quality
- API quota exceeded
- Model hallucinating

**Solutions**:
```json
// In backend/config.json, try these adjustments:
{
  "ai": {
    "temperature": 0.5,  // Lower = more consistent
    "maxTokens": 2500    // Reduce tokens
  },
  "quiz": {
    "maxCharactersPerDocument": 6000  // Reduce text sent
  }
}
```

Then redeploy:
```bash
git add backend/config.json
git commit -m "Adjust AI settings"
git push  # Auto-redeploys on Render
```

---

### 7. Frontend Can't Reach Backend

**Problem**: App loads but API calls fail

**Check 1**: Backend URL is correct
```javascript
// In browser console:
console.log(getBackendUrl())

// Should show your Render URL:
// https://your-service.onrender.com
```

**Check 2**: Network tab
- Open DevTools → Network
- Try generating a quiz
- Look for API requests
- Check response for errors

**Check 3**: Test backend directly
```
Visit: https://your-service.onrender.com/api/health
```

Should return JSON response.

---

### 8. Service Spins Down / Times Out

**Problem**: App is slow or "Service Offline" message

**Reason**: Free tier Render spins down after 15 minutes of inactivity

**Solutions**:

**Option 1**: Upgrade to Starter ($7/month)
- Always-on service
- Much faster
- Better for production

**Option 2**: Keep free plan
- App starts within 30 seconds when accessed
- Acceptable for light usage

---

### 9. Package.json Errors

**Error**: `Cannot find module express` or similar

**Solution**: Check dependencies are installed

In `backend/package.json`:
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "axios": "^1.6.2",
    "multer": "^1.4.5-lts.1",
    "pdf-parse": "^1.1.1"
  }
}
```

If missing:
```bash
cd backend
npm install express cors dotenv axios multer pdf-parse
```

---

### 10. Logs Show "Cannot GET /"

**Problem**: Visiting root URL returns text/html error

**This is normal** - Express only serves API routes, not static files.

The frontend (index.html, app.js) is served as static files.

**Solution**: 
Add static file serving to `backend/server.js`:

```javascript
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ... after other middleware ...

// Serve static files from root directory
app.use(express.static(path.join(__dirname, '..')));

// Serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// API routes (keep existing routes)
app.get('/api/health', ...);
// ... other API routes ...

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});
```

---

## 🔍 Debugging Steps

### 1. Check Render Logs
```
Render Dashboard → Your Service → Logs
```
Shows real-time server output. Look for:
- Startup errors
- Missing environment variables
- API errors when testing

### 2. Check Browser Console
```
F12 → Console tab
```
Look for:
- CORS errors
- Network errors
- JavaScript errors in app.js

### 3. Check Network Requests
```
F12 → Network tab
```
1. Perform action (e.g., upload PDF)
2. Look for API request
3. Click request
4. Check Response tab for error details

### 4. Test Endpoints Directly
```
Render URL: https://your-service.onrender.com

Test health:
https://your-service.onrender.com/api/health

Test frontend:
https://your-service.onrender.com/
```

---

## 📱 Mobile-Specific Issues

### App is slow on mobile
- Free tier Render plan is slow
- Mobile networks add latency
- Upgrade to Starter plan for better performance

### File upload fails on mobile
- Browser limits vary
- Try smaller files first
- Use mobile Chrome/Safari, not older browsers

### CORS errors on mobile
- Shouldn't happen with current setup
- Check `backend/config.json` CORS settings

---

## 🆘 Still Having Issues?

### Gather Information
1. **Screenshot of error message**
2. **Render logs (last 50 lines)**
3. **Browser console error (F12 → Console)**
4. **What you were trying to do**

### Check These Files
- `backend/package.json` - Dependencies correct?
- `backend/config.json` - Settings valid?
- `render.yaml` - Build/start commands correct?
- `app.js` - Using `getBackendUrl()`?
- `.env` - Has GROQ_API_KEY?

### Reset & Try Again
```bash
# Clear node modules
rm -rf node_modules backend/node_modules

# Reinstall
npm install
cd backend && npm install
cd ..

# Test locally
npm start

# If local works, push to Render
git add .
git commit -m "Reset deployment"
git push
```

---

## 📞 Support Resources

- **Groq Issues**: https://console.groq.com/support
- **Render Help**: https://render.com/docs
- **Express Docs**: https://expressjs.com
- **npm Help**: https://docs.npmjs.com/

---

## ✅ Quick Health Check

Run this checklist:

- [ ] Can access https://your-service.onrender.com
- [ ] `/api/health` returns JSON
- [ ] Browser console has no red errors
- [ ] GROQ_API_KEY is set in Render Environment
- [ ] `npm start` works locally
- [ ] PDF upload completes without timeout
- [ ] Generated quiz questions look good

If all checked ✅ your app is healthy!

---

## 🎯 Next Steps If Still Stuck

1. **Try local first**: Get it working on localhost before Render
2. **Read logs carefully**: Errors usually tell you exactly what's wrong
3. **Simplify**: Test with smaller PDFs, simpler requests
4. **Reset**: Clear modules and reinstall (see above)
5. **Upgrade**: Free tier has limits; try Starter plan to rule out performance issues
