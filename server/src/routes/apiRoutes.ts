import express from 'express'
import {
  proxyRequest,
  discoverApi,
  testEndpoint,
  validateJson,
  exportToExcel,
  exportToGeoJSON,
} from '../controllers/apiController'
import { authenticate } from '../middleware/auth'
import rateLimit from 'express-rate-limit'

const router = express.Router()

// Rate limiting для API запросов
const proxyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // максимум 100 запросов за окно
  message: 'Too many proxy requests, please try again later',
})

const discoveryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 час
  max: 20, // максимум 20 запросов в час
  message: 'Too many API discovery requests, please try again later',
})

// Публичные маршруты (не требуют аутентификации)
router.get('/proxy', proxyLimiter, proxyRequest)
router.post('/validate-json', validateJson)

// Защищенные маршруты (требуют аутентификации)
router.use('/discover', authenticate, discoveryLimiter)
router.post('/discover', discoverApi)

router.use('/test-endpoint', authenticate)
router.post('/test-endpoint', testEndpoint)

router.use('/export', authenticate)
router.post('/export/excel', exportToExcel)
router.post('/export/geojson', exportToGeoJSON)

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
  })
})

export default router
