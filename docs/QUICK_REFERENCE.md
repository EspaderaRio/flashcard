# 🚀 Flashcard App - Deployment Quick Card

## DEPLOY IN 3 STEPS

### Step 1️⃣: Get API Key
```
https://console.groq.com
→ Create Account
→ Get Free API Key
→ Copy it
```

### Step 2️⃣: Push to GitHub
```bash
git add .
git commit -m "Ready for Render"
git push origin main
```

### Step 3️⃣: Deploy on Render
```
https://render.com
→ Click "New +" → "Web Service"
→ Select your repo
→ Settings:
   Build: npm install && cd backend && npm install --production
   Start: npm start
→ Environment Variable:
   GROQ_API_KEY = [paste API key]
→ Click "Deploy"
→ Wait 2-3 minutes
→ Done! ✅
```

---

## LOCAL TESTING

### Windows
```bash
./setup.bat
npm start
```

### macOS/Linux
```bash
chmod +x setup.sh
./setup.sh
npm start
```

Then visit: **http://localhost:5000**

---

## KEY FILES

| File | Purpose |
|------|---------|
| `app.js` | Frontend app (updated) |
| `backend/server.js` | Backend API |
| `backend/config.json` | Settings |
| `package.json` | Build config |
| `render.yaml` | Render config |

---

## AFTER DEPLOYMENT

```
Every push to GitHub → Auto-deploys to Render
Visit: https://your-service.onrender.com
```

---

## TROUBLESHOOT

| Issue | Fix |
|-------|-----|
| "GROQ_API_KEY not found" | Add to Render Environment |
| API returns 404 | Check Render logs |
| Slow performance | Upgrade to Starter plan |
| CORS errors | Check `backend/config.json` |

---

## DOCS

- **QUICK_START.md** - Detailed guide
- **TROUBLESHOOTING.md** - All solutions
- **RENDER_DEPLOYMENT.md** - Full walkthrough
- **ARCHITECTURE.md** - How it works
- **README.md** - Everything

---

## URLS

| What | URL |
|------|-----|
| Groq API Key | https://console.groq.com |
| Render Dashboard | https://render.com/dashboard |
| Your App (After Deploy) | https://your-service.onrender.com |
| Backend Health | https://your-service.onrender.com/api/health |

---

## COMMANDS

```bash
npm start                    # Start locally
npm run install-all         # Install all dependencies
npm run dev                 # Start with auto-reload
git push origin main        # Deploy (auto on Render)
```

---

## FEATURES

✨ Generate quizzes from PDFs
🤖 AI-powered quiz generation
📚 Flashcard creation & study
🎨 Theme customization
📱 Mobile responsive
🔒 Secure & production-ready

---

## REMEMBER

✅ Get Groq API key FIRST
✅ Commit all changes to GitHub
✅ Render auto-deploys on push
✅ Free tier is slower (normal)
✅ Check logs if something breaks

---

## STUCK?

1. Read: TROUBLESHOOTING.md
2. Check: Render logs
3. Verify: GROQ_API_KEY is set
4. Test: http://localhost:5000 locally first

---

**READY? Start with QUICK_START.md** ⚡

---

## DEPLOYMENT TIMELINE

```
You                              Render
  │                               │
  ├─ Git push ──────────────────→ │
  │                               ├─ Clone repo
  │                               ├─ npm install
  │                               ├─ cd backend && npm install
  │                               ├─ npm start
  │                               ├─ Health check
  │                               └─ Service ready
  │                               │
  │ ← Service URL ────────────── │
  │   (after 2-3 min)
  │
  └─ Visit URL in browser
     ✅ App is live!
```

---

## BEFORE YOU DEPLOY

- [ ] Groq API key obtained
- [ ] Code committed to GitHub
- [ ] Tested locally: `npm start`
- [ ] .env NOT committed
- [ ] render.yaml exists

---

## SUCCESS CRITERIA

After deployment, you should see:

✅ App loads at your Render URL
✅ Can create flashcards
✅ Can upload PDF and generate quiz
✅ Can take quiz and see scores
✅ No red errors in browser console
✅ /api/health returns JSON

---

## ONE-LINER STATUS

Everything is ready. Get Groq key → Push to GitHub → Deploy on Render → Done! 🎉

---

**Version 2.0.0 - Production Ready**
