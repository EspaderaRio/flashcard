# ✅ Deployment Checklist

## Pre-Deployment (Local Testing)

### Code Quality
- [ ] All JavaScript files are valid (no syntax errors)
- [ ] No console errors when running locally
- [ ] `backend/server.js` starts without errors
- [ ] All dependencies listed in `backend/package.json`
- [ ] No hardcoded URLs (using `getBackendUrl()` function)

### Configuration
- [ ] `backend/.env` has `GROQ_API_KEY` set
- [ ] `backend/config.json` is valid JSON
- [ ] `backend/package.json` has all dependencies
- [ ] Root `package.json` has build scripts

### Frontend Testing
- [ ] App loads on http://localhost:5000
- [ ] Can create flashcards
- [ ] Can create quiz manually
- [ ] Can upload PDF and generate quiz
- [ ] Can take quiz and see results
- [ ] Theme switching works
- [ ] Responsive on mobile (use DevTools)

### Backend Testing
- [ ] GET /api/health returns 200 OK
- [ ] POST /api/generate-quiz-from-document works
- [ ] POST /api/generate-quiz works
- [ ] POST /api/generate-cards works
- [ ] API accepts file uploads
- [ ] PDF parsing works

### Browser Console
- [ ] No red errors
- [ ] No CORS errors
- [ ] API URLs are correct

### File System
- [ ] `.env` exists but is in `.gitignore`
- [ ] `node_modules/` is in `.gitignore`
- [ ] `backend/node_modules/` is in `.gitignore`
- [ ] All source files are committed

## GitHub Preparation

### Repository Setup
- [ ] Code pushed to GitHub main branch
- [ ] README.md is updated
- [ ] .gitignore is correct
- [ ] No sensitive files committed
- [ ] GROQ_API_KEY is NOT in any committed files

### Commit Quality
- [ ] Meaningful commit messages
- [ ] All changes are intentional
- [ ] No accidental files committed
- [ ] File permissions are correct

## Render Setup

### Account Preparation
- [ ] Render.com account created
- [ ] GitHub account connected to Render
- [ ] Groq API key obtained from console.groq.com
- [ ] Groq API key saved somewhere safe

### Repository Configuration
- [ ] `render.yaml` exists in root (optional but helpful)
- [ ] `package.json` has correct build command
- [ ] `package.json` has correct start command
- [ ] `backend/package.json` is valid

### Build Commands Verified
- [ ] Build: `npm install && cd backend && npm install --production`
- [ ] Start: `npm start`
- [ ] Both commands work locally first

## Render Deployment

### Service Creation
- [ ] Create Web Service
- [ ] Connect GitHub repository
- [ ] Select correct branch (main)
- [ ] Name service: `flashcard` (or your choice)
- [ ] Runtime: Node
- [ ] Region: Oregon (or your preference)
- [ ] Plan: Free (or Starter if preferred)

### Build Configuration
- [ ] Build Command: `npm install && cd backend && npm install --production`
- [ ] Start Command: `npm start`
- [ ] Node version: 18.x
- [ ] npm version: 9.x

### Environment Variables
- [ ] GROQ_API_KEY = [your actual key]
- [ ] NODE_ENV = production
- [ ] PORT = 5000 (optional, defaults to 3000)
- [ ] Click "Save Changes"

### Deployment
- [ ] Click "Create Web Service"
- [ ] Wait for deployment (2-3 minutes)
- [ ] Check Render logs for errors
- [ ] No red error messages in logs
- [ ] "Build succeeded" message appears

## Post-Deployment Testing

### Initial Access
- [ ] Service has a public URL assigned
- [ ] Can access the URL in browser
- [ ] Page loads (might be slow on free tier)
- [ ] No 404 or 500 errors

### Health Check
- [ ] GET /api/health returns JSON
- [ ] Response includes status: "OK"
- [ ] Timestamp is current

### API Testing
- [ ] POST /api/generate-quiz works
- [ ] POST /api/generate-quiz-from-document works
- [ ] File upload completes
- [ ] Response is valid JSON
- [ ] No 500 errors

### Frontend Functionality
- [ ] App loads completely
- [ ] All pages are accessible
- [ ] Can create flashcards
- [ ] Can generate quiz from topic
- [ ] Can upload PDF
- [ ] Generated questions look good
- [ ] Can take quiz
- [ ] Scores save correctly

### CORS & Network
- [ ] No CORS errors in console
- [ ] API requests complete successfully
- [ ] Network requests show 200/201 status
- [ ] Response times are reasonable

### Mobile Testing
- [ ] App works on mobile browsers
- [ ] File upload works on mobile
- [ ] Layout is responsive
- [ ] Touch interactions work

## Performance & Monitoring

### Render Dashboard
- [ ] Service is healthy (green status)
- [ ] No deployment errors
- [ ] Recent logs show normal operation
- [ ] CPU usage is reasonable
- [ ] Memory usage is reasonable

### Browser Performance
- [ ] Page loads in under 5 seconds
- [ ] API responses are under 2 seconds
- [ ] PDF upload completes in reasonable time
- [ ] Quiz generation completes
- [ ] No memory leaks in browser

### Scale Test (Optional)
- [ ] Try with larger PDFs
- [ ] Generate more questions
- [ ] Upload same PDF multiple times
- [ ] Create multiple quizzes

## Security Verification

### Secrets Management
- [ ] GROQ_API_KEY is in Render environment, not in code
- [ ] .env file is NOT committed
- [ ] No API keys in logs
- [ ] No passwords in database strings

### API Security
- [ ] HTTPS is enforced
- [ ] CORS is properly configured
- [ ] File uploads are validated
- [ ] Input is sanitized
- [ ] No SQL injection possible

### Data Protection
- [ ] Sensitive data not logged
- [ ] File uploads are temporary
- [ ] No data persisted unintentionally
- [ ] Privacy is protected

## Backup & Recovery

### Code Backup
- [ ] Code is on GitHub
- [ ] Multiple commits exist
- [ ] Can rollback if needed
- [ ] Local copy backed up

### Configuration Backup
- [ ] GROQ_API_KEY saved securely
- [ ] render.yaml is committed
- [ ] config.json is committed
- [ ] Environment setup documented

## Documentation

### Code Documentation
- [ ] README.md is updated
- [ ] QUICK_START.md is accurate
- [ ] RENDER_DEPLOYMENT.md is detailed
- [ ] API documentation is complete
- [ ] Troubleshooting guide is helpful

### Deployment Documentation
- [ ] Steps documented for future deploys
- [ ] Common issues documented
- [ ] Recovery procedures documented
- [ ] Team has access to documentation

## Final Checks

### Before Declaring Complete
- [ ] All tests passed ✅
- [ ] No red errors in logs
- [ ] App is performant
- [ ] Security is verified
- [ ] Documentation is complete
- [ ] Backup is confirmed
- [ ] Team is trained (if applicable)

### Celebrate! 🎉
- [ ] Service is live
- [ ] Users can access app
- [ ] Everything works as expected
- [ ] Ready for production use

---

## Deployment Checklist Summary

**Quick Check Before Clicking Deploy:**

```
Code Quality:        ✅ Local tests pass, no errors
Configuration:       ✅ GROQ_API_KEY saved, config.json valid  
Commits:             ✅ All changes committed to GitHub
Render Setup:        ✅ Account ready, repo connected
Environment:         ✅ GROQ_API_KEY added to Render
Build Command:       ✅ npm install && cd backend && npm install --production
Start Command:       ✅ npm start
Deploy:              ✅ Click "Create Web Service"
Monitor:             ✅ Watch logs for 2-3 minutes
Test:                ✅ Visit URL and test features
Done:                ✅ Success! 🚀
```

---

## If Something Goes Wrong

**Service won't start:**
1. Check Render logs for exact error
2. Verify GROQ_API_KEY is set
3. Confirm build command succeeded
4. Check `backend/package.json` has all dependencies

**API returns 404:**
1. Confirm backend server is running
2. Check build logs for errors
3. Verify `npm start` works locally
4. Look for startup error messages

**Slow performance:**
1. Free tier is slow initially (spins up on demand)
2. Upgrade to Starter plan for always-on
3. Check for network requests taking too long
4. Look at Render metrics dashboard

**Need to rollback:**
1. Go to Render dashboard
2. Go to deployments
3. Find previous successful deployment
4. Click "Redeploy"

---

## Next Deployment (Updates)

For future updates:

```
1. Make changes locally
2. Test locally: npm start
3. Commit: git add . && git commit -m "..."
4. Push: git push origin main
5. Render auto-deploys!
6. Monitor: Check Render logs
7. Test: Visit URL and verify
```

---

**You're ready to deploy!** ✨
