# 🔗 Hybrid Backend Integration Guide

## Overview

Your flashcard application now uses a **hybrid backend architecture** that separates concerns between two specialized services:

- **Render (Node.js/Express)**: Handles AI-powered quiz and flashcard generation
- **Cloudflare Workers + D1**: Handles quiz persistence, submission, and results

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                       Frontend (app.js)                          │
│                  Vanilla JS ES6+ in Browser                      │
│                                                                  │
│  ┌──────────────────────┐          ┌──────────────────────┐    │
│  │  Quiz Generation     │          │  Quiz Operations     │    │
│  │  - Topic-based       │          │  - Join/Start        │    │
│  │  - PDF-based         │          │  - Submit answers    │    │
│  │                      │          │  - View results      │    │
│  └──────────────────────┘          └──────────────────────┘    │
└────────────┬──────────────────────────────────┬─────────────────┘
             │                                  │
             │ REST API Calls                   │ REST API Calls
             │                                  │
       ┌─────▼──────────┐              ┌──────▼──────────────┐
       │  Render Backend │              │ Cloudflare Workers │
       │  (Express.js)   │              │   (D1 Database)    │
       │                 │              │                    │
       │ POST /api/gen*  │              │ POST /api/submit   │
       │ Groq AI API     │              │ GET /api/results   │
       │ PDF Parsing     │              │ GET /api/quizzes   │
       │ No Persistence  │              │ D1 SQL Database    │
       └─────────────────┘              └────────────────────┘
```

---

## Frontend Integration Points

### 1. URL Detection Functions

The frontend automatically detects which backend to use based on the environment:

```javascript
// Get Render backend URL (for quiz generation)
function getBackendUrl() {
  if (isProduction()) {
    return window.location.origin;  // Same domain on Render
  }
  return localStorage.getItem('backendUrl') || 'http://localhost:5000';
}

// Get Cloudflare backend URL (for quiz operations)
function getCloudflareUrl() {
  return localStorage.getItem('cloudflareUrl') || 
         'https://flashcard.espaderario.workers.dev';
}
```

### 2. Cloudflare Integration Functions

Four helper functions abstract away the Cloudflare API details:

```javascript
// Submit quiz answers for grading
async function submitQuizToCloudflare(quizId, answers) {
  const response = await fetch(`${getCloudflareUrl()}/api/submit`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({quizId, answers})
  });
  return response.json();
}

// Get quiz results and score
async function getQuizResultsFromCloudflare(quizId) {
  const response = await fetch(`${getCloudflareUrl()}/api/results/${quizId}`);
  return response.json();
}

// Create new quiz in Cloudflare
async function createQuizOnCloudflare(title, questions) {
  const response = await fetch(`${getCloudflareUrl()}/api/quizzes`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({title, questions})
  });
  return response.json();
}

// Retrieve quiz from Cloudflare
async function getQuizFromCloudflare(quizId) {
  const response = await fetch(`${getCloudflareUrl()}/api/quizzes/${quizId}`);
  return response.json();
}
```

---

## Updated Frontend Functions

### submitTeacherQuiz()

**File**: [app.js](app.js#L3792)

**Change**: Now uses `createQuizOnCloudflare()` instead of Render backend

```javascript
// Before: Tried to save to Render backend
const res = await fetch(`${getBackendUrl()}/api/quizzes`, {...})

// After: Saves to Cloudflare Workers
const cfResult = await createQuizOnCloudflare(title, teacherQuestions);
```

**Flow**:
1. Teacher creates quiz with AI generation (uses Render backend)
2. Questions are sent to Cloudflare to be saved
3. Quiz is also saved locally (localStorage) for offline access
4. If Cloudflare fails, shows warning but keeps local copy

### finishStudentQuiz()

**File**: [app.js](app.js#L4193)

**Change**: Now calls `submitQuizToCloudflare()` after saving locally

```javascript
// Before: Only saved to localStorage
saveStudentScore({...})

// After: Saves locally AND submits to Cloudflare
saveStudentScore({...})

// Async submission to Cloudflare
submitQuizToCloudflare(currentQuizId, answers);
```

**Flow**:
1. Student completes quiz
2. Score is saved locally (localStorage)
3. Answers are submitted to Cloudflare in background
4. Results available in both localStorage and Cloudflare

### loadStudentQuiz()

**File**: [app.js](app.js#L3902) and [app.js](app.js#L3944)

**Change**: Now fetches from Cloudflare instead of Render

```javascript
// Before: Fetched from Render
const res = await fetch(`${getBackendUrl()}/api/quizzes/${quizId}`);

// After: Fetches from Cloudflare
const data = await getQuizFromCloudflare(quizId);
```

**Flow**:
1. Student enters quiz ID
2. Frontend calls Cloudflare to fetch quiz
3. Questions are loaded and displayed
4. Student takes quiz

---

## Data Flow Examples

### Example 1: Teacher Creates and Saves Quiz

```
1. Teacher opens app
   └─> currentView = "teacher"

2. Teacher generates quiz from topic
   └─> POST http://localhost:5000/api/generate-quiz  (Render)
   └─> Groq AI generates questions
   └─> Returns questions with options

3. Teacher clicks "Create Quiz"
   └─> submitTeacherQuiz() called
   └─> POST https://cloudflare.workers.dev/api/quizzes  (Cloudflare)
   └─> Quiz saved to D1 database
   └─> Returns quizId

4. Quiz saved locally too
   └─> localStorage: teacher_quizzes_${userId}
   └─> Can take quiz offline
```

### Example 2: Student Joins and Takes Quiz

```
1. Student enters quiz ID
   └─> loadStudentQuiz() called
   └─> GET https://cloudflare.workers.dev/api/quizzes/quiz123  (Cloudflare)
   └─> Retrieves questions from D1

2. Questions displayed
   └─> currentView = "teacher-quiz"
   └─> Student answers questions

3. Student finishes
   └─> finishStudentQuiz() called
   └─> saveStudentScore() - saves to localStorage
   └─> submitQuizToCloudflare() - sends to Cloudflare (async)
   └─> POST https://cloudflare.workers.dev/api/submit

4. Results available
   └─> localStorage (instant)
   └─> Cloudflare D1 (cloud sync)
```

---

## API Endpoints Reference

### Render Backend (Quiz Generation)

**Base URL**: `http://localhost:5000` (dev) or `https://your-service.onrender.com` (prod)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/generate-quiz` | Generate quiz from topic |
| POST | `/api/generate-quiz-from-document` | Generate quiz from PDF |
| POST | `/api/generate-cards` | Generate flashcards |
| GET | `/api/health` | Health check |

### Cloudflare Backend (Quiz Operations)

**Base URL**: `https://flashcard.espaderario.workers.dev`

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/quizzes/:id` | Get quiz by ID |
| POST | `/api/quizzes` | Create new quiz |
| PUT | `/api/quizzes/:id` | Update quiz |
| DELETE | `/api/quizzes/:id` | Delete quiz |
| POST | `/api/submit` | Submit quiz answers |
| GET | `/api/results/:quizId` | Get quiz results |
| GET | `/api/sets` | List flashcard sets |
| POST | `/api/sets` | Create flashcard set |

---

## Configuration

### Manual URL Configuration

If you need to use different URLs, set them in browser console or localStorage:

```javascript
// Set Render backend
localStorage.setItem('backendUrl', 'https://my-render-service.onrender.com');
setBackendUrl('https://my-render-service.onrender.com');

// Set Cloudflare backend
localStorage.setItem('cloudflareUrl', 'https://my-cloudflare-worker.dev');
setCloudflareUrl('https://my-cloudflare-worker.dev');

// Reload page
location.reload();
```

### Environment Detection

```javascript
// isProduction() returns true if:
// - window.location.hostname contains "render" or domain name
// - window.location.protocol is "https"

// Development: localhost:5000 + Cloudflare (default)
// Production: Render domain + Cloudflare (default)
```

---

## Error Handling

Each integration point has error handling:

### Graceful Degradation

```javascript
// If Cloudflare unavailable, still works with localStorage
try {
  const result = await submitQuizToCloudflare(quizId, answers);
} catch (error) {
  console.warn("Cloud sync failed, using local storage");
  // Application continues with localStorage data
}
```

### User Feedback

```javascript
// Warnings for sync failures
if (result && result.error) {
  toast("⚠️ Saved locally but failed to sync to cloud");
} else {
  toast("✅ Quiz created and synced to cloud!");
}
```

---

## Database Schema (Cloudflare D1)

### Quizzes Table

```sql
CREATE TABLE quizzes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Questions Table

```sql
CREATE TABLE questions (
  id TEXT PRIMARY KEY,
  quiz_id TEXT NOT NULL,
  question TEXT NOT NULL,
  options JSON NOT NULL,
  correct TEXT,
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
);
```

### Submissions Table

```sql
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

## Testing the Integration

### Local Development

1. **Start Render Backend**:
   ```bash
   cd backend
   npm start
   ```

2. **Open Frontend**:
   ```bash
   # Open index.html in browser
   # http://localhost:8000 or similar
   ```

3. **Verify URLs in Console**:
   ```javascript
   console.log(getBackendUrl());    // Should be http://localhost:5000
   console.log(getCloudflareUrl()); // Should be https://flashcard.espaderario.workers.dev
   ```

### Test Quiz Flow

1. **Create quiz**:
   - Teacher: Generate → Submit → Should sync to Cloudflare
   - Check browser console for POST request

2. **Take quiz**:
   - Student: Enter quiz ID → Should load from Cloudflare
   - Check browser console for GET request

3. **Submit answers**:
   - Student: Finish quiz → Should sync to Cloudflare
   - Check browser console for POST /submit request

---

## Troubleshooting

### "Quiz not found"

**Cause**: Quiz doesn't exist in Cloudflare D1

**Solution**:
1. Verify quiz was created: Check Cloudflare dashboard logs
2. Verify quiz ID is correct
3. Check Cloudflare Worker is deployed

### "Network error"

**Cause**: Backend unreachable

**Solution**:
```javascript
// Check URLs
console.log(getBackendUrl());
console.log(getCloudflareUrl());

// Test endpoints
fetch(getBackendUrl() + '/api/health')
fetch(getCloudflareUrl() + '/') 
```

### Quiz saved locally but not in cloud

**Cause**: Cloudflare sync failed

**Solution**:
1. Check internet connection
2. Check Cloudflare Worker status
3. Check browser console for fetch errors
4. Manually retry: `submitQuizToCloudflare(quizId, answers)`

---

## Performance Considerations

### Render Backend
- Quiz generation: ~3-5 seconds
- Limited by Groq API rate limits
- No database (stateless)
- Can scale horizontally

### Cloudflare Backend
- Quiz retrieval: ~100-200ms
- Instant, globally distributed
- D1 Database with 100K operations/day free tier
- Auto-scales automatically

### Optimization Tips

1. **Cache quizzes locally**:
   ```javascript
   // Quizzes saved in localStorage automatically
   // Offline access works without connection
   ```

2. **Batch operations**:
   - Submit multiple quiz results together if needed
   - Reduces network requests

3. **Monitor usage**:
   - Check Cloudflare analytics
   - Watch for D1 quota usage
   - Adjust quiz generation limits in backend/config.json

---

## Future Enhancements

- [ ] Offline quiz sync when connection restored
- [ ] Quiz sharing with dynamic links
- [ ] Real-time collaborative quiz creation
- [ ] Analytics dashboard connected to Cloudflare
- [ ] User authentication via Cloudflare
- [ ] Quiz versioning and history
- [ ] Leaderboards using Cloudflare Analytics Engine

---

## Support & Debugging

### Enable Debug Logging

Add to browser console:

```javascript
// Log all API calls
const originalFetch = window.fetch;
window.fetch = function(...args) {
  console.log('API Call:', args[0], args[1]);
  return originalFetch.apply(this, args);
};
```

### Check Integration Points

```javascript
// Verify URL detection
console.log('Is Production:', isProduction());
console.log('Backend URL:', getBackendUrl());
console.log('Cloudflare URL:', getCloudflareUrl());

// Test Cloudflare functions
submitQuizToCloudflare('test-quiz', {0: 'A'});
getQuizFromCloudflare('test-quiz');
createQuizOnCloudflare('Test', [{question: 'Q?', options: ['A']}]);
```

### Monitor Network Requests

1. Open DevTools (F12)
2. Go to Network tab
3. Take a quiz
4. Look for:
   - `/api/generate-quiz` → Render
   - `/api/quizzes` → Cloudflare
   - `/api/submit` → Cloudflare
   - `/api/results` → Cloudflare

---

## Summary

Your application now has a **production-ready hybrid architecture**:

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Frontend | Vanilla JS + localStorage | Quiz UI & offline support |
| Generation | Render + Express.js + Groq | AI-powered content creation |
| Persistence | Cloudflare Workers + D1 | Quiz storage & submission handling |

**Key Benefits**:
- ✅ Expensive generation on Render (auto-scales)
- ✅ Fast persistence on Cloudflare (global)
- ✅ Offline-first with cloud sync
- ✅ Resilient to failures (local fallbacks)
- ✅ Cost-effective (free tiers available)

For questions or issues, check the main [HYBRID_ARCHITECTURE.md](HYBRID_ARCHITECTURE.md) document or review the [backend README](backend/README.md).
