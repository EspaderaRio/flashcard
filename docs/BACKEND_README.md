# Flashcard Backend API v2.0

An AI-powered backend service for generating quizzes and flashcards from documents using the Groq API.

## Features

- **PDF Document Analysis**: Extract text and analyze PDF files to generate quiz questions
- **Document-Based Options**: Quiz options include content directly from the source document
- **AI Quiz Generation**: Generate quizzes based on topics using Groq's API
- **Flashcard Generation**: Create flashcards from documents or topics
- **Configuration-Driven**: Easily customize behavior via `config.json`
- **RESTful API**: Easy-to-use endpoints for all operations

## Installation

1. **Clone or download the backend files**

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Groq API key:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   PORT=5000
   ```

4. **Start the server**:
   ```bash
   npm start
   ```

   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

The server will run on `http://localhost:5000` by default.

## Configuration

Edit `config.json` to customize behavior:

- **port**: Server port (default: 5000)
- **fileUpload**: File upload settings
  - `maxFileSize`: Maximum file size in bytes (default: 10MB)
  - `allowedMimeTypes`: Supported file types
- **ai**: AI configuration
  - `provider`: API provider (default: groq)
  - `model`: Model to use (default: mixtral-8x7b-32768)
  - `temperature`: Response creativity (0-1)
  - `maxTokens`: Maximum tokens per response
- **quiz**: Quiz generation settings
  - `maxQuestions`: Maximum questions per quiz
  - `maxCharactersPerDocument`: Document text limit
  - `optionsCount`: Number of options per question
- **flashcards**: Flashcard settings
  - `maxCards`: Maximum flashcards per request

## API Endpoints

### Generate Quiz from Document
```
POST /api/generate-quiz-from-document
Content-Type: multipart/form-data

Parameters:
- file: PDF, TXT, or MD file
- numQuestions: Number of questions to generate (1-50)

Response:
{
  "success": true,
  "questions": [
    {
      "question": "What is...",
      "options": ["Option A", "Option B from document", "Option C", "Option D"],
      "correct": "Option B from document",
      "fromDocument": true
    }
  ],
  "documentName": "file.pdf",
  "charactersAnalyzed": 8000,
  "documentPhrasesUsed": 5
}
```

### Generate Flashcards from Document
```
POST /api/generate-cards-from-document
Content-Type: multipart/form-data

Parameters:
- file: PDF, TXT, or MD file
- count: Number of flashcards to generate (1-100)

Response:
{
  "success": true,
  "cards": [
    {
      "question": "Question?",
      "answer": "Answer from document."
    }
  ],
  "documentName": "file.pdf",
  "charactersAnalyzed": 8000
}
```

### Generate Quiz by Topic
```
POST /api/generate-quiz
Content-Type: application/json

Body:
{
  "topic": "photosynthesis",
  "numQuestions": 5
}

Response:
{
  "success": true,
  "questions": [
    {
      "question": "What is...",
      "options": ["A", "B", "C", "D"],
      "correct": "A"
    }
  ]
}
```

### Generate Flashcards by Topic
```
POST /api/generate-cards
Content-Type: application/json

Body:
{
  "topic": "biology",
  "count": 10
}

Response:
{
  "success": true,
  "cards": [
    {
      "question": "What is X?",
      "answer": "X is..."
    }
  ]
}
```

### Quiz Management

**Create Quiz**:
```
POST /api/quizzes
{
  "title": "My Quiz",
  "questions": [...]
}
```

**Get Quiz**:
```
GET /api/quizzes/:quizId
```

**Update Quiz**:
```
PUT /api/quizzes/:quizId
{
  "title": "Updated Title",
  "questions": [...]
}
```

**Delete Quiz**:
```
DELETE /api/quizzes/:quizId
```

**List All Quizzes**:
```
GET /api/quizzes
```

**Health Check**:
```
GET /api/health
```

## Document-Based Options Feature

The `/api/generate-quiz-from-document` endpoint intelligently:

1. **Extracts key phrases** from the document
2. **Ensures at least one option** per question comes directly from the document
3. **Creates plausible distractors** that are document-related
4. **Marks questions** with a `fromDocument` flag for tracking

This ensures that quizzes are always grounded in the actual document content.

## Environment Variables

Create a `.env` file in the backend directory:

```env
GROQ_API_KEY=sk_live_your_groq_api_key
PORT=5000
NODE_ENV=production
```

## Error Handling

All endpoints return appropriate HTTP status codes:

- `200`: Success
- `201`: Resource created
- `400`: Bad request (missing parameters, unsupported file type)
- `404`: Not found
- `500`: Server error

Error responses include a JSON object with an `error` field describing the issue.

## Deployment

### Local
```bash
npm install
npm start
```

### Docker
Create a `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

Build and run:
```bash
docker build -t flashcard-backend .
docker run -p 5000:5000 -e GROQ_API_KEY=your_key flashcard-backend
```

### Heroku/Render.com
1. Push to GitHub
2. Connect repository to deployment platform
3. Set `GROQ_API_KEY` environment variable
4. Deploy

## File Structure

```
backend/
├── server.js           # Main application
├── config.json         # Configuration settings
├── package.json        # Dependencies
├── .env.example        # Example environment variables
└── README.md          # This file
```

## Troubleshooting

**"Groq API key not configured"**
- Ensure `.env` file exists and has `GROQ_API_KEY` set

**"Failed to extract text from document"**
- Check that the PDF is not corrupted
- Ensure file type is supported (PDF, TXT, MD)

**"Generated questions contain placeholder options"**
- The AI model returned low-quality responses
- Try again or adjust document length in `config.json`

**"Backend returned placeholder options"**
- Check your Groq API key and rate limits
- Verify the document is properly formatted

## Support

For issues or feature requests, contact the development team or check the main application repository.

## License

MIT
