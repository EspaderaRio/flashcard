# 📚 Flashcard AI - Full Stack Application

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-green)
![License](https://img.shields.io/badge/license-MIT-blue)

An AI-powered flashcard and quiz generation application with a **hybrid backend architecture**:
- **Frontend**: Vanilla JavaScript with responsive UI
- **Backend Generation**: Node.js Express API with Groq AI (Render)
- **Backend Persistence**: Cloudflare Workers + D1 Database (Quiz storage)
- **Deployment**: Single repository deployable to Render.com

## 🏗️ Hybrid Architecture

This app uses a **dual-backend approach** for optimal performance:

```
Frontend (app.js)
    ├─→ Render Backend (Quiz Generation)
    │   └─ AI, PDF parsing, flashcard generation
    └─→ Cloudflare Workers (Quiz Operations)
        └─ Quiz storage, submission, results
```

**Benefits**:
- ⚡ Fast quiz generation on Render (scales horizontally)
- 🌍 Global quiz persistence on Cloudflare (< 100ms latency)
- 📱 Offline-first with cloud sync
- 💰 Cost-effective (free tiers available)

## 🚀 Features

✨ **Interactive Flashcards**
- Create custom flashcard sets
- Browse and study existing sets
- Flip animations and progress tracking

📊 **Quiz System**
- Teacher quiz creation and management
- Student quiz joining and scoring
- Item analysis and performance tracking

🤖 **AI-Powered Generation**
- Generate quizzes from topics
- Generate flashcards from topics
- Generate quizzes from PDF documents
- Smart document-based options

📄 **Document Analysis**
- PDF text extraction
- Automatic question generation
- Document-based quiz options
- Support for PDF, TXT, and MD files

🎨 **Customization**
- Multiple theme presets
- Custom color schemes
- Responsive mobile design

## 🏗️ Architecture Details

### Dual-Backend System

**Render Backend** (Quiz Generation)
- Handles AI-powered quiz creation
- Processes PDF documents
- Generates flashcards from content
- No database (stateless)
- Scalable with high demand

**Cloudflare Workers** (Quiz Operations)
- Stores quizzes in D1 database
- Handles quiz submissions
- Calculates and stores scores
- Global distribution (< 100ms)
- Serverless and auto-scaling

### Data Flow

1. **Quiz Creation**:
   ```
   Teacher generates quiz (Render AI)
   → Saves to Cloudflare D1
   → Also saved locally (localStorage)
   ```

2. **Quiz Taking**:
   ```
   Student loads quiz (from Cloudflare D1)
   → Takes quiz locally
   → Submits answers to Cloudflare
   → Scores calculated and stored
   ```

3. **Offline Support**:
   ```
   All data cached in localStorage
   → Works without internet
   → Syncs to cloud when connection available
   ```

### Integration Points

- `getBackendUrl()` - Returns Render API URL (auto-detected)
- `getCloudflareUrl()` - Returns Cloudflare Workers URL
- `createQuizOnCloudflare()` - POST quiz to cloud
- `getQuizFromCloudflare()` - GET quiz from cloud
- `submitQuizToCloudflare()` - POST answers to cloud
- `getQuizResultsFromCloudflare()` - GET scores from cloud

📖 **Full Details**: See [HYBRID_ARCHITECTURE.md](HYBRID_ARCHITECTURE.md) and [BACKEND_INTEGRATION_GUIDE.md](BACKEND_INTEGRATION_GUIDE.md)

## 📦 Project Structure

```
flashcard/
├── 📄 index.html              # Main HTML
├── 🎨 styles.css              # Global styles
├── 💻 app.js                  # Frontend application (7000+ lines)
├── 📦 package.json            # Root configuration
├── 🔧 render.yaml             # Render deployment config
├── 📋 .gitignore              # Git ignore rules
│
├── 📚 Documentation/
│   ├── QUICK_START.md         # 5-minute deployment guide
│   ├── RENDER_DEPLOYMENT.md   # Detailed deployment guide
│   ├── DEPLOYMENT_SUMMARY.md  # Overview of setup
│   ├── TROUBLESHOOTING.md     # Debugging guide
│   └── README.md              # This file
│
├── 🔌 backend/                # Express API server
│   ├── server.js              # Main application
│   ├── config.json            # Configuration settings
│   ├── package.json           # Dependencies
│   ├── .env.example           # Environment template
│   └── README.md              # Backend documentation
│
└── 📁 Static Assets/
    ├── www/                   # Static files
    ├── fonts/                 # Font files
    ├── icons/                 # Icon files
    ├── images/                # Image assets
    └── pdfs/                  # Sample PDFs
```

## ⚡ Quick Start

### Local Development (5 minutes)

**Requirements**: Node.js 14+

**Windows**:
```bash
./setup.bat
npm start
```

**macOS/Linux**:
```bash
chmod +x setup.sh
./setup.sh
npm start
```

Then visit: **http://localhost:5000**

### Deploy to Render (10 minutes)

See [QUICK_START.md](QUICK_START.md) for step-by-step instructions.

## 🔑 Configuration

### Environment Variables

Create `backend/.env`:
```env
GROQ_API_KEY=your_groq_api_key_here
NODE_ENV=production
PORT=5000
```

Get your free Groq API key: https://console.groq.com

### Backend Settings

Edit `backend/config.json`:
```json
{
  "port": 5000,
  "ai": {
    "model": "mixtral-8x7b-32768",
    "temperature": 0.7,
    "maxTokens": 3000
  },
  "quiz": {
    "maxQuestions": 50,
    "maxCharactersPerDocument": 8000
  }
}
```

## 🌐 API Endpoints

### Quiz Generation from PDF
```http
POST /api/generate-quiz-from-document
Content-Type: multipart/form-data

Parameters:
- file: PDF, TXT, or MD file
- numQuestions: 1-50

Response:
{
  "success": true,
  "questions": [...],
  "documentName": "file.pdf",
  "charactersAnalyzed": 8000
}
```

### Quiz Generation by Topic
```http
POST /api/generate-quiz
Content-Type: application/json

{
  "topic": "biology",
  "numQuestions": 5
}
```

### Flashcard Generation
```http
POST /api/generate-cards
Content-Type: application/json

{
  "topic": "history",
  "count": 10
}
```

### Quiz Management
```http
POST /api/quizzes              # Create quiz
GET /api/quizzes               # List all
GET /api/quizzes/:id           # Get quiz
PUT /api/quizzes/:id           # Update quiz
DELETE /api/quizzes/:id        # Delete quiz
```

Full API docs in [backend/README.md](backend/README.md)

## 🛠 Development

### Available Commands

```bash
# Install all dependencies
npm run install-all

# Start production server
npm start

# Start with auto-reload
npm run dev

# Build for deployment
npm run build
```

### Frontend Architecture

- **Single Page Application** (SPA)
- **No build step required** - works directly in browser
- **localStorage** for persistence
- **Responsive design** - mobile and desktop
- **Modular functions** - easy to extend

### Backend Architecture

- **Express.js** REST API
- **Groq API** for AI generation
- **pdf-parse** for document analysis
- **Multer** for file uploads
- **CORS** enabled for cross-domain requests

## 📊 File Size & Performance

- **Frontend**: ~400KB (uncompressed)
- **Backend**: ~20KB (core code)
- **Dependencies**: Auto-installed on deploy

Optimized for:
- Fast load times
- Minimal data transfer
- Efficient PDF processing

## 🔐 Security

✅ **Best Practices**:
- API keys never committed (use .env)
- CORS properly configured
- File upload validation
- Input sanitization
- HTTPS by default on Render

## 📱 Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers

## 🚀 Deployment

### Render.com (Recommended)

1. Push code to GitHub
2. Connect repository to Render
3. Add `GROQ_API_KEY` environment variable
4. Deploy!

See [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md) for detailed steps.

### Other Platforms

- **Heroku**: Similar to Render, update Procfile
- **Vercel**: Frontend only, need separate backend
- **Docker**: See Dockerfile example in [backend/README.md](backend/README.md)
- **AWS**: Can use EC2 or Elastic Beanstalk

## 🐛 Troubleshooting

**Problem**: App won't start locally
→ Ensure Node.js 14+ installed, run `npm install`

**Problem**: "GROQ_API_KEY not configured"
→ Add to `backend/.env` or Render environment

**Problem**: API returns 404
→ Check backend server is running on port 5000

**Problem**: PDF upload fails
→ File too large? Check `backend/config.json` maxFileSize

See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for more solutions.

## 📚 Documentation

- **[QUICK_START.md](QUICK_START.md)** - Deploy in 5 minutes ⚡
- **[RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md)** - Complete deployment guide 📖
- **[DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md)** - Overview and features 📋
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Debug common issues 🔧
- **[backend/README.md](backend/README.md)** - Backend API docs 🔌

## 🎯 Roadmap

Future enhancements:
- [ ] Database persistence (PostgreSQL)
- [ ] User authentication
- [ ] Cloud storage for documents
- [ ] Advanced analytics
- [ ] Mobile app (React Native)
- [ ] Real-time collaboration
- [ ] Export to Anki format

## 📄 License

MIT - Feel free to use for personal and commercial projects

## 👨‍💻 Development

### Local Testing
```bash
# Terminal 1: Start backend
cd backend
npm start

# Terminal 2: Open frontend
# Just open index.html in browser or visit http://localhost:5000
```

### Making Changes

1. **Frontend**: Edit `app.js`, refresh browser
2. **Backend**: Edit `backend/server.js`, restart server
3. **Config**: Edit `backend/config.json`, restart server

### Testing Before Deploy

```bash
# Test locally first
npm start

# Visit http://localhost:5000
# Test all features:
# - Create flashcards
# - Generate quiz from topic
# - Upload PDF and generate quiz
# - Test quiz taking

# Then deploy
git push origin main
```

## 🤝 Contributing

1. Test locally before pushing
2. Commit with descriptive messages
3. Keep dependencies updated
4. Update documentation when changing API

## 📞 Support

- **Issues**: Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- **Questions**: Read documentation files
- **Bugs**: Report with browser console errors and Render logs
- **Features**: Suggest in issues

## 🙏 Acknowledgments

Built with:
- **Groq API** for AI generation
- **Express.js** for backend
- **Render** for hosting
- **pdf-parse** for document processing

## 📈 Stats

- **Lines of Code**: 7000+ (frontend), 500+ (backend)
- **Functions**: 150+ helper functions
- **API Endpoints**: 10+ endpoints
- **Configuration Options**: 20+ settings

## 🎉 Getting Started

Ready to deploy? Start here:

1. **[QUICK_START.md](QUICK_START.md)** - 5-minute deployment ⚡
2. **[RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md)** - Detailed guide 📖
3. **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Help and debugging 🔧

---

**Made with ❤️ for learners everywhere**

Last updated: January 2026
