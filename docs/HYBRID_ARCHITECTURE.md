# 🏗️ Hybrid Architecture - Render + Cloudflare

## Overview

Your flashcard application uses a **hybrid backend architecture**:

```
┌─────────────────────────────────────────────────────────┐
│                    User's Browser                        │
│                   (Frontend: app.js)                     │
└──────┬──────────────────────────────────┬───────────────┘
       │                                  │
       │ Quiz Generation                  │ Quiz Submission
       │ Flashcard Generation             │ Results
       │ (GET /api/generate-*)            │ (POST /api/submit)
       │                                  │
       ▼                                  ▼
┌──────────────────────┐        ┌─────────────────────────┐
│  Render Backend      │        │  Cloudflare Workers     │
│  (Express.js)        │        │  (D1 Database)          │
├──────────────────────┤        ├─────────────────────────┤
│ • Quiz generation    │        │ • Quiz creation         │
│ • Flashcard gen      │        │ • Quiz submission       │
│ • PDF analysis       │        │ • Score storage         │
│ • Document options   │        │ • Results retrieval     │
└──────────────────────┘        └─────────────────────────┘
```

---

## Backend Separation

### Render (Quiz Generation)
**URL**: `https://your-service.onrender.com`

**Endpoints**:
- `POST /api/generate-quiz` - Generate quiz from topic
- `POST /api/generate-quiz-from-document` - Generate quiz from PDF
- `POST /api/generate-cards` - Generate flashcards
- `GET /api/health` - Health check

**Features**:
- Groq AI integration
- PDF document processing
- Document-based quiz options
- Stateless (no persistence)

### Cloudflare Workers (Quiz Management)
**URL**: `https://flashcard.espaderario.workers.dev`

**Endpoints**:
- `POST /api/quizzes` - Create quiz
- `GET /api/quizzes/:id` - Get quiz
- `PUT /api/quizzes/:id` - Update quiz
- `DELETE /api/quizzes/:id` - Delete quiz
- `POST /api/submit` - Submit answers
- `GET /api/results/:quizId` - Get results
- `GET /api/sets` - List all sets
- `POST /api/sets` - Publish set

**Features**:
- D1 Database persistence
- CORS support
- Quiz submission handling
- Score tracking

---

## Frontend Configuration

### Automatic URL Detection

The frontend automatically detects its environment and uses the appropriate backends:

```javascript
// Render backend (for generation)
function getBackendUrl() {
  if (isProduction()) {
    return window.location.origin;  // On Render
  }
  return 'http://localhost:5000';    // Local development
}

// Cloudflare backend (for submission)
function getCloudflareUrl() {
  return localStorage.getItem('cloudflareUrl') || 
         'https://flashcard.espaderario.workers.dev';
}
```

### Manual Configuration

If needed, you can set custom URLs:

```javascript
// Set Render backend
setBackendUrl('https://my-custom-render-url.com');

// Set Cloudflare backend
setCloudflareUrl('https://my-custom-cloudflare-url.com');
```

---

## Frontend API Calls

### Quiz Generation (Render)
```javascript
// Generate quiz from topic
const response = await fetch(`${getBackendUrl()}/api/generate-quiz`, {
  method: 'POST',
  body: JSON.stringify({ topic: 'biology', numQuestions: 5 })
});

// Generate quiz from PDF
const formData = new FormData();
formData.append('file', pdfFile);
formData.append('numQuestions', 10);

const response = await fetch(`${getBackendUrl()}/api/generate-quiz-from-document`, {
  method: 'POST',
  body: formData
});
```

### Quiz Management (Cloudflare)
```javascript
// Submit quiz answers
const result = await submitQuizToCloudflare(quizId, answers);

// Get quiz from database
const quiz = await getQuizFromCloudflare(quizId);

// Get quiz results
const results = await getQuizResultsFromCloudflare(quizId);
```

---

## Database Models

### Cloudflare D1 Schema

```sql
-- Quizzes table
CREATE TABLE quizzes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Questions table
CREATE TABLE questions (
  id TEXT PRIMARY KEY,
  quiz_id TEXT NOT NULL,
  question TEXT NOT NULL,
  options JSON NOT NULL,
  correct TEXT,
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
);

-- Submissions table
CREATE TABLE submissions (
  id TEXT PRIMARY KEY,
  quiz_id TEXT NOT NULL,
  answers JSON NOT NULL,
  score INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
);
```

---

## Workflow Examples

### Creating and Taking a Quiz

```
1. User creates quiz using Render backend
   POST https://render-url/api/generate-quiz
   ↓ Returns questions

2. Frontend calls Cloudflare to save quiz
   POST https://cloudflare-url/api/quizzes
   ↓ Returns quizId

3. User takes quiz and submits answers
   POST https://cloudflare-url/api/submit
   ↓ Calculates score

4. User views results from Cloudflare
   GET https://cloudflare-url/api/results/:quizId
   ↓ Returns scores
```

### Importing PDF and Creating Quiz

```
1. User uploads PDF
   ↓
2. Frontend sends to Render backend
   POST https://render-url/api/generate-quiz-from-document
   ↓ Extract text, generate questions

3. Frontend saves to Cloudflare
   POST https://cloudflare-url/api/quizzes
   ↓ Store in D1

4. Quiz is ready to take
```

---

## API Helper Functions

Added to `app.js`:

```javascript
// Submit quiz answers
async submitQuizToCloudflare(quizId, answers)

// Get results
async getQuizResultsFromCloudflare(quizId)

// Create quiz
async createQuizOnCloudflare(title, questions)

// Get quiz
async getQuizFromCloudflare(quizId)
```

---

## Development Setup

### Local Development

1. **Render Backend** (local):
   ```bash
   cd backend
   npm start
   # Runs on http://localhost:5000
   ```

2. **Cloudflare Backend** (use production):
   ```javascript
   // In app.js, getCloudflareUrl() defaults to:
   // https://flashcard.espaderario.workers.dev
   ```

3. **Frontend**:
   ```bash
   # Open index.html in browser
   # Or run: npm start (if setup)
   ```

### Production Deployment

1. **Render Backend**:
   - Deployed at: `https://your-service.onrender.com`
   - Frontend auto-detects this URL

2. **Cloudflare Backend**:
   - Already deployed at: `https://flashcard.espaderario.workers.dev`
   - Or your custom Cloudflare URL
   - Update via: `setCloudflareUrl('your-url')`

---

## CORS Configuration

### Render Backend
```javascript
// Automatically allows all origins
app.use(cors({
  origin: "*",
  credentials: true
}));
```

### Cloudflare Workers
```typescript
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
};
```

---

## Error Handling

Frontend automatically handles errors from both backends:

```javascript
try {
  // Try to call Cloudflare
  const result = await submitQuizToCloudflare(quizId, answers);
} catch (error) {
  console.error('Cloudflare error:', error);
  // Fallback to localStorage or retry
  localStorage.setItem('pendingSubmission', JSON.stringify({quizId, answers}));
  toast('Unable to submit. Retry when connection is available.');
}
```

---

## Configuration Reference

### Environment Variables

**Render (.env)**:
```env
GROQ_API_KEY=your_api_key
NODE_ENV=production
PORT=5000
```

**Cloudflare (wrangler.toml)**:
```toml
name = "flashcard"
type = "javascript"
account_id = "your_account_id"
workers_dev = true
route = "your-domain/*"

[[env.production.kv_namespaces]]
binding = "QUIZ_KV"
```

### localStorage Keys Used

```javascript
backendUrl              // Render backend URL override
cloudflareUrl          // Cloudflare backend URL override
studentQuizScores      // Cached quiz scores
```

---

## Performance Considerations

### Render Backend
- Stateless (no persistence)
- Fast generation (< 5 seconds typically)
- Rate limited by Groq API free tier
- Can scale horizontally

### Cloudflare Backend
- D1 Database (SQLite)
- Instant response times (< 100ms)
- Automatic global distribution
- Free tier includes 100,000 read/write operations

---

## Monitoring & Debugging

### Check Render Backend
```
GET https://your-render-service.onrender.com/api/health
Response: {"status": "OK", "timestamp": "...", ...}
```

### Check Cloudflare Backend
```
GET https://flashcard.espaderario.workers.dev/
Response: Cloudflare Workers response
```

### Browser Console
```javascript
// Check URLs
console.log('Render:', getBackendUrl());
console.log('Cloudflare:', getCloudflareUrl());

// Check last error
console.error(lastError);
```

### Render Logs
```
Render Dashboard → Your Service → Logs
Watch for API call logs
```

### Cloudflare Logs
```
Cloudflare Dashboard → Workers → Logs
View request/response details
```

---

## Troubleshooting

### "Cannot reach Cloudflare backend"
- Check URL: `setCloudflareUrl('https://flashcard.espaderario.workers.dev')`
- Verify worker is deployed
- Check CORS in Cloudflare code

### "Cannot reach Render backend"
- On Render: should auto-detect
- Local: ensure backend running on 5000
- Check: `getBackendUrl()` in console

### Quiz creation fails
- Try Cloudflare first: `getCloudflareUrl()` in console
- Check network tab in browser DevTools
- Verify quiz structure matches D1 schema

### Score not saving
- Check Cloudflare worker is running
- Verify POST /api/submit endpoint
- Check D1 database connections

---

## Future Enhancements

- [ ] Offline support with sync on reconnect
- [ ] Local caching of quizzes
- [ ] Batch submission for reliability
- [ ] Analytics integration
- [ ] User authentication
- [ ] Quiz sharing links

---

## Summary

| Aspect | Render | Cloudflare |
|--------|--------|-----------|
| **Purpose** | AI generation | Data persistence |
| **Technology** | Express.js | Workers + D1 |
| **Data** | Stateless | Database |
| **Speed** | ~5 seconds | < 100ms |
| **Scalability** | High | Unlimited |
| **Cost** | Free tier | Free tier |

Your app benefits from both:
- ✅ Fast, AI-powered quiz generation (Render)
- ✅ Reliable data persistence (Cloudflare)
- ✅ Zero-downtime deployment
- ✅ Global distribution
