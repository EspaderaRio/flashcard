import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Load configuration
const configPath = path.join(__dirname, 'config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: config.fileUpload.maxFileSize },
  fileFilter: (req, file, cb) => {
    if (config.fileUpload.allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, TXT, and MD files are allowed'));
    }
  }
});

// Middleware
app.use(cors(config.cors));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static files from parent directory
const parentDir = path.dirname(__dirname);
app.use(express.static(parentDir));

// In-memory storage (replace with database in production)
let quizzes = new Map();
let quizCounter = 1;

// ============= HELPER FUNCTIONS =============

/**
 * Extract text from uploaded document (PDF, TXT, or MD)
 */
async function extractTextFromDocument(file) {
  if (file.mimetype === 'application/pdf') {
    const data = await pdfParse(file.buffer);
    return data.text;
  } else if (file.mimetype === 'text/plain' || file.mimetype === 'text/markdown') {
    return file.buffer.toString('utf-8');
  }
  throw new Error('Unsupported file type');
}

/**
 * Extract key phrases/sentences from document text
 * Used to create options that are directly from the document
 */
function extractKeyPhrases(text, count = 5) {
  // Split into sentences
  const sentences = text
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 10 && s.length < 150);

  // Get diverse sentences from throughout the document
  const phrases = [];
  const step = Math.max(1, Math.floor(sentences.length / count));
  
  for (let i = 0; i < sentences.length && phrases.length < count; i += step) {
    if (sentences[i] && !phrases.includes(sentences[i])) {
      phrases.push(sentences[i]);
    }
  }

  return phrases.slice(0, count);
}

/**
 * Generate quiz from uploaded document with document-derived options
 * POST /api/generate-quiz-from-document
 * FormData: { file: File, numQuestions: number }
 */
app.post('/api/generate-quiz-from-document', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const numQuestions = Math.min(
      parseInt(req.body.numQuestions) || 5,
      config.quiz.maxQuestions
    );

    // Extract text from document
    let documentText = '';
    try {
      documentText = await extractTextFromDocument(req.file);
    } catch (error) {
      return res.status(400).json({ error: 'Failed to extract text from document: ' + error.message });
    }

    if (documentText.length === 0) {
      return res.status(400).json({ error: 'Document appears to be empty' });
    }

    // Extract key phrases from document for use as options
    const keyPhrases = extractKeyPhrases(documentText, numQuestions * 2);

    // Limit text to avoid token limits
    const limitedText = documentText.substring(0, config.quiz.maxCharactersPerDocument);

    const openaiKey = process.env.GROQ_API_KEY;
    if (!openaiKey) {
      return res.status(500).json({ error: 'Groq API key not configured' });
    }

    const prompt = `You are a quiz generator. Based on the following document content, generate exactly ${numQuestions} multiple choice quiz questions.

IMPORTANT INSTRUCTIONS FOR OPTIONS:
- For EACH question, generate 4 options
- ONE option MUST be from this list of key document phrases (marked as [FROM_DOC]):
${keyPhrases.map((phrase, i) => `  [FROM_DOC_${i}]: "${phrase}"`).join('\n')}

- The other 3 options should be realistic alternatives not from the document
- One of these 4 options is the correct answer
- Options must be actual terms/concepts derived from the document or logically related
- The "correct" field MUST exactly match one of the 4 options

DOCUMENT CONTENT:
---
${limitedText}
---

SPECIAL REQUIREMENT:
At least one option per question should reference key content from the document. Use the [FROM_DOC_*] phrases as inspiration for creating realistic alternatives.

Generate the questions in this EXACT JSON format:
[
  {
    "question": "What is the primary function of photosynthesis?",
    "options": ["Convert light energy to chemical energy", "Process that occurs in plant cells", "Break down glucose", "Produce oxygen only"],
    "correct": "Convert light energy to chemical energy",
    "fromDocument": true
  }
]

Return ONLY valid JSON array. Do not include any text before or after the JSON.`;

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: config.ai.model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert quiz generator. You extract key information from documents and create meaningful multiple-choice questions with realistic options, ensuring at least one option is always derived from the document content. Always respond with ONLY valid JSON, no additional text.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: config.ai.temperature,
        max_tokens: config.ai.maxTokens
      },
      {
        headers: {
          'Authorization': `Bearer ${openaiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.choices[0].message.content;
    let questions;
    
    try {
      questions = JSON.parse(content);
    } catch (e) {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        questions = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse AI response as JSON');
      }
    }

    // Validate that we got meaningful options, not placeholders
    const hasPlaceholders = questions.some(q => 
      (q.options || []).some(opt => /^option\s+[a-d]$/i.test(opt.trim()))
    );

    if (hasPlaceholders) {
      throw new Error('Generated questions contain placeholder options. Please try again.');
    }

    // Ensure we have exactly the requested number of questions
    const finalQuestions = questions.slice(0, numQuestions);

    res.json({ 
      success: true,
      questions: finalQuestions,
      documentName: req.file.originalname,
      charactersAnalyzed: limitedText.length,
      documentPhrasesUsed: keyPhrases.length
    });

  } catch (error) {
    console.error('Document Analysis Error:', error.message);
    res.status(500).json({ 
      error: error.message || 'Failed to generate quiz from document'
    });
  }
});

/**
 * Generate flashcards from uploaded document
 * POST /api/generate-cards-from-document
 * FormData: { file: File, count: number }
 */
app.post('/api/generate-cards-from-document', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const count = Math.min(
      parseInt(req.body.count) || 10,
      config.flashcards.maxCards
    );

    // Extract text from document
    let documentText = '';
    try {
      documentText = await extractTextFromDocument(req.file);
    } catch (error) {
      return res.status(400).json({ error: 'Failed to extract text from document: ' + error.message });
    }

    if (documentText.length === 0) {
      return res.status(400).json({ error: 'Document appears to be empty' });
    }

    const limitedText = documentText.substring(0, config.quiz.maxCharactersPerDocument);

    const openaiKey = process.env.GROQ_API_KEY;
    if (!openaiKey) {
      return res.status(500).json({ error: 'Groq API key not configured' });
    }

    const prompt = `Based on the following document content, generate exactly ${count} flashcard question-answer pairs.

DOCUMENT CONTENT:
---
${limitedText}
---

Requirements:
- Extract questions and answers directly from the document
- Questions should test understanding of key concepts
- Answers should be detailed but concise (1-3 sentences)
- Focus on important facts, definitions, and concepts from the document
- Return ONLY valid JSON, no other text

Generate flashcards in this JSON format:
[
  {
    "question": "What is photosynthesis?",
    "answer": "A process in which plants use sunlight to synthesize foods from carbon dioxide and water, producing oxygen as a byproduct."
  }
]`;

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: config.ai.model,
        messages: [
          {
            role: 'system',
            content: 'You are a flashcard generator. Extract key information from documents and create meaningful flashcard pairs based on the content. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: config.ai.temperature,
        max_tokens: config.ai.maxTokens
      },
      {
        headers: {
          'Authorization': `Bearer ${openaiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.choices[0].message.content;
    let cards;
    
    try {
      cards = JSON.parse(content);
    } catch (e) {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        cards = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse AI response as JSON');
      }
    }

    res.json({ 
      success: true,
      cards: cards.slice(0, count),
      documentName: req.file.originalname,
      charactersAnalyzed: limitedText.length
    });

  } catch (error) {
    console.error('Card Generation Error:', error.message);
    res.status(500).json({ 
      error: error.message || 'Failed to generate cards from document'
    });
  }
});

/**
 * Generate quiz questions using Groq API (topic-based)
 */
app.post('/api/generate-quiz', async (req, res) => {
  try {
    const { topic, numQuestions = 5 } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const openaiKey = process.env.GROQ_API_KEY;
    if (!openaiKey) {
      return res.status(500).json({ error: 'Groq API key not configured' });
    }

    const prompt = `Generate exactly ${numQuestions} multiple choice quiz questions about "${topic}". 

For each question, provide 4 realistic, meaningful options where one is correct and three are plausible alternatives.
    
Format your response as a JSON array with this structure:
[
  {
    "question": "What is the capital of France?",
    "options": ["Paris", "London", "Berlin", "Madrid"],
    "correct": "Paris"
  }
]

Requirements:
- Create questions that test core knowledge of the topic
- Options must be realistic and meaningful (never use "Option A", "Option B", etc.)
- The "correct" field must exactly match one of the 4 options
- Return ONLY valid JSON array, no other text`;

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: config.ai.model,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful quiz generator. Create meaningful quiz questions with realistic options. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: config.ai.temperature,
        max_tokens: 2000
      },
      {
        headers: {
          'Authorization': `Bearer ${openaiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.choices[0].message.content;
    let questions;
    
    try {
      questions = JSON.parse(content);
    } catch (e) {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        questions = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse AI response as JSON');
      }
    }

    res.json({ 
      success: true,
      questions: questions.slice(0, numQuestions)
    });

  } catch (error) {
    console.error('AI Generation Error:', error.message);
    res.status(500).json({ 
      error: error.message || 'Failed to generate quiz questions'
    });
  }
});

/**
 * Generate flashcards using Groq API
 * POST /api/generate-cards
 * Body: { topic: string, count: number }
 */
app.post('/api/generate-cards', async (req, res) => {
  try {
    const { topic, count = 10 } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const openaiKey = process.env.GROQ_API_KEY;
    if (!openaiKey) {
      console.error('GROQ_API_KEY not found in environment variables');
      return res.status(500).json({ error: 'Groq API key not configured' });
    }

    const prompt = `Generate ${count} flashcard question-answer pairs about "${topic}".
    
Format your response as a JSON array with this structure:
[
  {
    "question": "Question or prompt",
    "answer": "Answer or explanation"
  }
]

Return ONLY valid JSON, no other text.`;

    try {
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: config.ai.model,
          messages: [
            {
              role: 'system',
              content: 'You are a helpful flashcard generator. Always respond with valid JSON only.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: config.ai.temperature,
          max_tokens: 2000
        },
        {
          headers: {
            'Authorization': `Bearer ${openaiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const content = response.data.choices[0].message.content;
      let cards;
      
      try {
        cards = JSON.parse(content);
      } catch (e) {
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          cards = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Failed to parse AI response as JSON');
        }
      }

      res.json({ 
        success: true,
        cards: cards.slice(0, count)
      });
    } catch (apiError) {
      console.error('Groq API Error:', apiError.response?.status, apiError.response?.data || apiError.message);
      throw apiError;
    }

  } catch (error) {
    console.error('Card Generation Error:', error.message);
    res.status(500).json({ 
      error: error.message || 'Failed to generate flashcards',
      details: error.response?.data?.error?.message || null
    });
  }
});

// ============= QUIZ MANAGEMENT ENDPOINTS =============

/**
 * Create a new quiz
 * POST /api/quizzes
 * Body: { title: string, questions: array }
 */
app.post('/api/quizzes', (req, res) => {
  try {
    const { title, questions } = req.body;

    if (!title || !questions || questions.length === 0) {
      return res.status(400).json({ error: 'Title and questions are required' });
    }

    const quizId = String(quizCounter++);
    const quiz = {
      quizId,
      title,
      questions,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    quizzes.set(quizId, quiz);

    res.status(201).json({
      success: true,
      quizId,
      message: 'Quiz created successfully'
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get a quiz by ID
 * GET /api/quizzes/:quizId
 */
app.get('/api/quizzes/:quizId', (req, res) => {
  try {
    const { quizId } = req.params;
    const quiz = quizzes.get(quizId);

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    res.json({
      success: true,
      quiz: {
        quizId: quiz.quizId,
        title: quiz.title,
        createdAt: quiz.createdAt
      },
      questions: quiz.questions
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Update a quiz
 * PUT /api/quizzes/:quizId
 * Body: { title: string, questions: array }
 */
app.put('/api/quizzes/:quizId', (req, res) => {
  try {
    const { quizId } = req.params;
    const { title, questions } = req.body;

    const quiz = quizzes.get(quizId);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    if (title) quiz.title = title;
    if (questions) quiz.questions = questions;
    quiz.updatedAt = new Date().toISOString();

    quizzes.set(quizId, quiz);

    res.json({
      success: true,
      message: 'Quiz updated successfully',
      quizId
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Delete a quiz
 * DELETE /api/quizzes/:quizId
 */
app.delete('/api/quizzes/:quizId', (req, res) => {
  try {
    const { quizId } = req.params;

    if (!quizzes.has(quizId)) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    quizzes.delete(quizId);

    res.json({
      success: true,
      message: 'Quiz deleted successfully'
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * List all quizzes
 * GET /api/quizzes
 */
app.get('/api/quizzes', (req, res) => {
  try {
    const quizList = Array.from(quizzes.values()).map(quiz => ({
      quizId: quiz.quizId,
      title: quiz.title,
      questionCount: quiz.questions.length,
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt
    }));

    res.json({
      success: true,
      quizzes: quizList
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============= HEALTH CHECK =============

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    features: ['PDF Analysis', 'Document-based Quiz Generation', 'AI Quiz Generation', 'Flashcard Generation']
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Flashcard Backend API v2.0',
    version: '2.0.0',
    description: 'AI-powered flashcard and quiz generation system with PDF document analysis',
    features: [
      'Generate quizzes from PDF documents',
      'Generate flashcards from documents',
      'AI-powered quiz generation by topic',
      'Document options included in quiz generation',
      'Configurable via JSON settings'
    ],
    endpoints: {
      health: 'GET /api/health',
      generateQuizFromDocument: 'POST /api/generate-quiz-from-document',
      generateCardsFromDocument: 'POST /api/generate-cards-from-document',
      generateQuiz: 'POST /api/generate-quiz',
      generateCards: 'POST /api/generate-cards',
      createQuiz: 'POST /api/quizzes',
      getQuiz: 'GET /api/quizzes/:quizId',
      updateQuiz: 'PUT /api/quizzes/:quizId',
      deleteQuiz: 'DELETE /api/quizzes/:quizId',
      listQuizzes: 'GET /api/quizzes'
    }
  });
});

// Catch-all for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found', path: req.path, method: req.method });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Flashcard Backend v2.0 running on port ${PORT}`);
  console.log(`📝 API available at http://localhost:${PORT}`);
  console.log(`⚙️  Configuration loaded from config.json`);
  console.log(`📊 Features: PDF Analysis, AI Generation, Document-based Options`);
});
