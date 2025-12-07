import express from 'express'
import authRoutes from './authRoutes'
import presetRoutes from './presetRoutes'
import apiRoutes from './apiRoutes'

const router = express.Router()

// API маршруты
router.use('/auth', authRoutes)
router.use('/presets', presetRoutes)
router.use('/api', apiRoutes)

// 404 обработчик для API маршрутов
router.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    path: req.originalUrl,
    method: req.method,
  })
})

export default router
