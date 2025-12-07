import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Простые маршруты
app.get('/', (req, res) => {
  res.json({ message: 'Flexi Parser API' })
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Упрощенные маршруты аутентификации
app.get('/api/auth/check', (req, res) => {
  res.json({
    authenticated: false,
    user: null,
    message: 'Auth system in development',
  })
})

app.post('/api/auth/register', (req, res) => {
  console.log('Register attempt:', req.body)
  res.json({
    success: true,
    message: 'Registration endpoint (development mode)',
    user: {
      id: 1,
      email: req.body.email || 'test@example.com',
      name: req.body.name || 'Test User',
    },
  })
})

app.post('/api/auth/login', (req, res) => {
  console.log('Login attempt:', req.body)
  res.json({
    success: true,
    message: 'Login successful (development mode)',
    token: 'dev-token-' + Date.now(),
    user: {
      id: 1,
      email: req.body.email || 'test@example.com',
      name: 'Development User',
    },
  })
})

// Маршруты для API Discovery (упрощенные)
app.post('/api/discover', (req, res) => {
  const { url } = req.body
  console.log('Discovery request for:', url)

  const mockEndpoints = [
    {
      url: 'https://jsonplaceholder.typicode.com/posts',
      type: 'JSON API',
      score: 9,
      description: 'Test posts endpoint',
    },
    {
      url: 'https://jsonplaceholder.typicode.com/users',
      type: 'JSON API',
      score: 8,
      description: 'Test users endpoint',
    },
  ]

  res.json({
    success: true,
    endpoints: mockEndpoints,
  })
})

app.post('/api/discover/test', (req, res) => {
  const { url } = req.body
  console.log('Testing endpoint:', url)

  res.json({
    success: true,
    status: 200,
    contentType: 'application/json',
    size: 1024,
    structure: 'JSON Array',
    data: [{ id: 1, title: 'Test data' }],
    headers: {
      'content-type': 'application/json',
    },
  })
})

// Маршруты для парсера
app.post('/api/parser/parse', (req, res) => {
  const { url, dataPath } = req.body
  console.log('Parser request:', { url, dataPath })

  res.json({
    success: true,
    message: 'Parser endpoint (development mode)',
    data: [
      { id: 1, name: 'Item 1', value: 100 },
      { id: 2, name: 'Item 2', value: 200 },
      { id: 3, name: 'Item 3', value: 300 },
    ],
    metadata: {
      count: 3,
      source: url,
      timestamp: new Date().toISOString(),
    },
  })
})

// Запуск сервера
app.listen(PORT, () => {
  console.log(`
🚀 Server running on http://localhost:${PORT}
📡 Available endpoints:
   GET  /api/health
   GET  /api/auth/check
   POST /api/auth/register
   POST /api/auth/login
   POST /api/discover
   POST /api/discover/test
   POST /api/parser/parse
  `)
})
