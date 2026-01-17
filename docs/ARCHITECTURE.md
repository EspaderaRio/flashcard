# Architecture Overview

## Local Development Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Your Computer                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Browser (http://localhost:5000)              │   │
│  │                                                       │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │           Frontend (app.js)                  │   │   │
│  │  │  - Flashcards                               │   │   │
│  │  │  - Quiz System                              │   │   │
│  │  │  - PDF Upload                               │   │   │
│  │  │  - Theme Management                         │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  │                      ↕ (API calls)                  │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │     Backend (Node.js Express)                │   │   │
│  │  │  - API Routes (/api/...)                    │   │   │
│  │  │  - File Upload Handling                     │   │   │
│  │  │  - Groq AI Integration                      │   │   │
│  │  │  - Quiz Generation                          │   │   │
│  │  │  - PDF Processing                           │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  │                      ↕ (HTTP)                       │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │        Groq API (Cloud)                      │   │   │
│  │  │  - AI Models                                 │   │   │
│  │  │  - Quiz Generation                          │   │   │
│  │  │  - Text Processing                          │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  │                                                      │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Production Deployment on Render

```
┌──────────────────────────────────────────────────────────────────┐
│                          Render.com                              │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │     Single Web Service: flashcard-api.onrender.com       │   │
│  │                                                           │   │
│  │  ┌─────────────────────────────────────────────────┐    │   │
│  │  │           Frontend Files Served                 │    │   │
│  │  │  (index.html, app.js, styles.css, etc)        │    │   │
│  │  │  GET / → index.html                           │    │   │
│  │  └─────────────────────────────────────────────────┘    │   │
│  │                      ↕                                   │   │
│  │  ┌─────────────────────────────────────────────────┐    │   │
│  │  │           Backend API Routes                    │    │   │
│  │  │  POST /api/generate-quiz-from-document        │    │   │
│  │  │  POST /api/generate-quiz                       │    │   │
│  │  │  POST /api/generate-cards                      │    │   │
│  │  │  GET  /api/health                              │    │   │
│  │  │  ... (other quiz management routes)            │    │   │
│  │  └─────────────────────────────────────────────────┘    │   │
│  │                      ↕ (HTTPS)                          │   │
│  │  ┌─────────────────────────────────────────────────┐    │   │
│  │  │        Groq API (External)                      │    │   │
│  │  │  - AI Models                                    │    │   │
│  │  │  - Quiz Generation                             │    │   │
│  │  └─────────────────────────────────────────────────┘    │   │
│  │                                                           │   │
│  │  Environment Variables:                                  │   │
│  │  - GROQ_API_KEY                                          │   │
│  │  - NODE_ENV=production                                   │   │
│  │                                                           │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘

User's Browser
     ↓
https://flashcard-api.onrender.com
     ↓
Render serves index.html (frontend loads)
     ↓
app.js detects production (uses same domain)
     ↓
API calls to: https://flashcard-api.onrender.com/api/...
     ↓
Backend handles requests
     ↓
Calls Groq API when needed
     ↓
Returns response to frontend
```

## Request Flow Diagram

### PDF Quiz Generation

```
1. User selects PDF file
   │
   ├─→ Frontend reads file (FileReader API)
   │
   ├─→ Frontend sends to: POST /api/generate-quiz-from-document
   │
   ├─→ Backend receives multipart/form-data
   │
   ├─→ Backend extracts text from PDF (pdf-parse)
   │
   ├─→ Backend extracts key phrases from document
   │
   ├─→ Backend sends to Groq API:
   │   - Document text
   │   - Key phrases
   │   - Instructions for document-based options
   │
   ├─→ Groq AI generates quiz questions
   │
   ├─→ Backend validates response
   │
   ├─→ Backend returns questions to frontend:
   {
     "success": true,
     "questions": [
       {
         "question": "...",
         "options": ["from doc", "alt1", "alt2", "alt3"],
         "correct": "from doc",
         "fromDocument": true
       }
     ]
   }
   │
   ├─→ Frontend displays questions
   │
   └─→ User takes quiz
```

## File Organization

```
flashcard/
│
├── 🎨 Frontend (Static Files)
│   ├── index.html              (HTML entry point)
│   ├── app.js                  (7000+ lines, main app logic)
│   ├── styles.css              (Global styles)
│   ├── manifest.json           (PWA manifest)
│   ├── service-worker.js       (Offline support)
│   └── [other static files]
│
├── 🔌 Backend (Node.js API)
│   ├── server.js               (Express server)
│   ├── config.json             (Settings)
│   ├── package.json            (Dependencies)
│   └── .env                    (Secrets, not in git)
│
├── 📚 Documentation
│   ├── README.md               (This file)
│   ├── QUICK_START.md
│   ├── RENDER_DEPLOYMENT.md
│   ├── TROUBLESHOOTING.md
│   └── DEPLOYMENT_SUMMARY.md
│
├── 📦 Configuration
│   ├── package.json            (Root monorepo config)
│   ├── render.yaml             (Render deployment)
│   └── .gitignore              (Git ignore rules)
│
└── 📁 Assets
    ├── www/                    (More static files)
    ├── fonts/
    ├── icons/
    ├── images/
    └── pdfs/
```

## Data Flow

```
User Interaction
    ↓
Frontend (app.js) captures event
    ↓
Validate input locally
    ↓
Send HTTP request to Backend API
    ↓
Backend processes:
  - File upload → Extract text
  - Quiz generation → Call Groq API
  - Data validation
    ↓
Backend returns JSON response
    ↓
Frontend receives response
    ↓
Update DOM / localStorage
    ↓
Render updated UI to user
```

## Technology Stack

### Frontend
```
JavaScript (ES6+)
├── No build tool required
├── Vanilla JS (no frameworks)
├── localStorage for persistence
├── Fetch API for HTTP requests
└── CSS3 for styling
```

### Backend
```
Node.js + Express
├── RESTful API design
├── Groq AI integration (axios)
├── File upload (multer)
├── PDF processing (pdf-parse)
├── Environment config (dotenv)
└── CORS support
```

### Infrastructure
```
Render.com
├── Node.js runtime
├── Auto-scaling
├── HTTPS by default
├── Auto-deployment from GitHub
└── Environment variable management
```

## Performance Optimization

### Frontend
- Single-file app (minimal requests)
- Lazy loading of PDFs
- Service worker for offline support
- localStorage caching

### Backend
- Connection pooling ready
- Efficient PDF parsing
- API response caching possible
- Stream support for large files

### Network
- Gzip compression
- HTTPS/HTTP2
- CDN support
- Minimal payload sizes

## Security Layers

```
User's Browser
    ↓
[HTTPS/SSL]
    ↓
Render Server (HTTPS enforced)
    ↓
[CORS validation]
    ↓
Express Middleware
    ↓
[Input validation]
    ↓
[File upload validation]
    ↓
API Routes
    ↓
[GROQ_API_KEY in env vars]
    ↓
Groq API (External, secure)
```

## Deployment Pipeline

```
Developer commits code
    ↓
Push to GitHub (main branch)
    ↓
Render webhook triggered
    ↓
Render pulls latest code
    ↓
Run: npm install && cd backend && npm install --production
    ↓
Run: npm start
    ↓
Backend starts on port 5000
    ↓
Frontend served as static files
    ↓
Service available at:
   https://flashcard-xxx.onrender.com
    ↓
New version live!
```

---

**This architecture supports:**
- ✅ Simple local development
- ✅ One-click Render deployment
- ✅ Auto-scaling and performance
- ✅ Security best practices
- ✅ Easy maintenance and updates
