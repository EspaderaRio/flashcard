# 🚀 Flashcard App - Quick Deployment Guide

## Your Repository Structure

```
flashcard/
├── app.js                    # Frontend application
├── index.html                # Frontend HTML
├── styles.css                # Frontend styles
├── package.json              # Root package.json (monorepo config)
├── .gitignore                # Git ignore rules
├── render.yaml               # Render deployment config
├── RENDER_DEPLOYMENT.md      # Full deployment guide
│
├── backend/                  # Backend API service
│   ├── server.js             # Express server
│   ├── config.json           # Configuration
│   ├── package.json          # Backend dependencies
│   ├── .env.example          # Environment template
│   └── README.md             # Backend docs
│
├── www/                      # Static assets
├── fonts/
├── icons/
└── pdfs/
```

## 🔥 Quick Start - Deploy in 5 Minutes

### Step 1: Get Your Groq API Key

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up or login
3. Create an API key
4. Copy it (you'll need it in Step 4)

### Step 2: Push to GitHub

```bash
git add .
git commit -m "Ready for Render deployment"
git push origin main
```

### Step 3: Go to Render

1. Visit [render.com](https://render.com)
2. Sign up with GitHub
3. Click "Dashboard"
4. Click "New +"
5. Select "Web Service"

### Step 4: Configure the Service

| Setting | Value |
|---------|-------|
| **Repository** | Select your flashcard repo |
| **Name** | `flashcard` |
| **Runtime** | `Node` |
| **Region** | `Oregon` |
| **Branch** | `main` |
| **Build Command** | `npm install && cd backend && npm install --production` |
| **Start Command** | `npm start` |
| **Plan** | `Free` |

### Step 5: Add Environment Variables

In Render dashboard, click "Environment" and add:

```
GROQ_API_KEY = [paste your Groq API key here]
NODE_ENV = production
```

### Step 6: Deploy

Click "Create Web Service" and wait 2-3 minutes for deployment.

### Step 7: Verify

Once deployed, your service URL will be something like:
```
https://flashcard-abc123.onrender.com
```

Test it:
- Open URL in browser
- Click "Create Quiz" → "Generate from PDF"
- Upload a PDF and generate questions

✅ **Done!** Your app is now live!

## 📝 Your Frontend Already Works!

The app.js frontend automatically:
- ✅ Detects if it's on Render or localhost
- ✅ Uses the same domain for the backend
- ✅ No URL configuration needed
- ✅ Works immediately after deployment

## 🔄 After Deployment - Updates

Every time you update your code:

```bash
git add .
git commit -m "Updated feature"
git push origin main
```

Render automatically redeploys! 🚀

## 🐛 Common Issues

### "Cannot find GROQ_API_KEY"
→ Add it in Render dashboard Environment section

### API returns 404
→ Check Render logs (Dashboard → Your Service → Logs)

### CORS errors
→ Already handled in backend/config.json with `"origin": "*"`

### Slow performance
→ Use Starter plan ($7/month) instead of Free

## 📊 Monitoring

In Render dashboard:
- **Logs** - See real-time server output
- **Metrics** - CPU, memory, requests
- **Deployments** - View deployment history

## 💡 Pro Tips

1. **Never commit .env** - Use environment variables in Render
2. **Test locally first** - Run `npm start` locally before pushing
3. **Save Groq API key** - You'll need it if you redeploy
4. **Monitor usage** - Free tier has limited resources
5. **Use GitHub** - Easier to manage and auto-deploy

## 🎓 Learn More

- Full guide: [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md)
- Backend docs: [backend/README.md](backend/README.md)
- Render help: [render.com/docs](https://render.com/docs)

## 🆘 Need Help?

1. Check Render logs for error messages
2. Read RENDER_DEPLOYMENT.md for detailed troubleshooting
3. Verify GROQ_API_KEY is set correctly
4. Ensure all files are committed to GitHub

---

**Your app is now production-ready!** 🎉
