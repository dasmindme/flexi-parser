import express from 'express'
import { body } from 'express-validator'
import { register, login, logout, checkAuth, refreshToken } from '../controllers/authController'
import { authenticate } from '../middleware/auth'

const router = express.Router()

// Валидация для регистрации
const registerValidation = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters')
    .isLength({ max: 30 })
    .withMessage('Username cannot exceed 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers and underscores'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('email').optional().isEmail().withMessage('Please provide a valid email').normalizeEmail(),
]

// Валидация для логина
const loginValidation = [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
]

// Публичные маршруты
router.post('/register', registerValidation, register)
router.post('/login', loginValidation, login)

// Защищенные маршруты
router.post('/logout', authenticate, logout)
router.get('/check', authenticate, checkAuth)
router.post('/refresh', authenticate, refreshToken)

export default router
