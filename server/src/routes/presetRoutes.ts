import express from 'express'
import { body } from 'express-validator'
import {
  getPresets,
  getPresetById,
  createPreset,
  updatePreset,
  deletePreset,
  getPresetsByCategory,
  searchPresets,
} from '../controllers/presetController'
import { authenticate } from '../middleware/auth'

const router = express.Router()

// Валидация для создания/обновления пресета
const presetValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Preset name is required')
    .isLength({ min: 2 })
    .withMessage('Preset name must be at least 2 characters')
    .isLength({ max: 100 })
    .withMessage('Preset name cannot exceed 100 characters'),
  body('url')
    .trim()
    .notEmpty()
    .withMessage('URL is required')
    .isURL()
    .withMessage('Please provide a valid URL'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('category')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Category cannot exceed 50 characters'),
]

// Все маршруты требуют аутентификации
router.use(authenticate)

// Получить все пресеты пользователя
router.get('/', getPresets)

// Поиск пресетов
router.get('/search', searchPresets)

// Получить пресеты по категории
router.get('/category/:category', getPresetsByCategory)

// Получить конкретный пресет
router.get('/:id', getPresetById)

// Создать новый пресет
router.post('/', presetValidation, createPreset)

// Обновить пресет
router.put('/:id', presetValidation, updatePreset)

// Удалить пресет
router.delete('/:id', deletePreset)

export default router
