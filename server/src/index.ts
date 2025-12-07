import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'

// Контроллеры
import * as apiController from './controllers/apiController'
import * as authController from './controllers/authController'
import * as presetController from './controllers/presetController'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Ручная обработка CORS для предварительных запросов
app.options('*', cors())

// API маршруты
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  })
})

// Auth routes
app.post('/api/auth/register', authController.register)
app.post('/api/auth/login', authController.login)
app.post('/api/auth/logout', authController.logout)
app.get('/api/auth/check', authController.checkAuth)
app.post('/api/auth/refresh', authController.refreshToken)

// Preset routes
app.get('/api/presets', presetController.getPresets)
app.get('/api/presets/:id', presetController.getPresetById)
app.get('/api/presets/category/:category', presetController.getPresetsByCategory)
app.get('/api/presets/search', presetController.searchPresets)
app.post('/api/presets', presetController.createPreset)
app.put('/api/presets/:id', presetController.updatePreset)
app.delete('/api/presets/:id', presetController.deletePreset)

// API proxy and discovery
app.get('/api/proxy', apiController.proxyRequest)
app.post('/api/discover', apiController.discoverApi)
app.post('/api/discover/test', apiController.testEndpoint)
app.post('/api/validate-json', apiController.validateJson)
app.post('/api/export/excel', apiController.exportToExcel)
app.post('/api/export/geojson', apiController.exportToGeoJSON)

// Запуск сервера
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`)
  console.log(`📡 Available endpoints:`)
  console.log(`   GET  /api/health`)
  console.log(`   GET  /api/auth/check`)
  console.log(`   POST /api/auth/register`)
  console.log(`   POST /api/auth/login`)
  console.log(`   POST /api/discover`)
  console.log(`   POST /api/discover/test`)
  console.log(`\n✅ Server ready!`)
})
