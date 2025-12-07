import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IPreset extends Document {
  name: string
  url: string
  description?: string
  category?: string
  user: mongoose.Schema.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

interface IPresetModel extends Model<IPreset> {
  findByUser(userId: string): Promise<IPreset[]>
  findByCategory(userId: string, category: string): Promise<IPreset[]>
}

const presetSchema = new Schema<IPreset, IPresetModel>(
  {
    name: {
      type: String,
      required: [true, 'Preset name is required'],
      trim: true,
      minlength: [2, 'Preset name must be at least 2 characters long'],
      maxlength: [100, 'Preset name cannot exceed 100 characters'],
    },
    url: {
      type: String,
      required: [true, 'URL is required'],
      trim: true,
      validate: {
        validator: function (v: string) {
          try {
            new URL(v)
            return true
          } catch {
            return false
          }
        },
        message: 'Please provide a valid URL',
      },
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    category: {
      type: String,
      trim: true,
      default: '',
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
        return ret
      },
    },
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
        return ret
      },
    },
  }
)

// Индексы для оптимизации запросов
presetSchema.index({ user: 1, name: 1 }, { unique: true })
presetSchema.index({ user: 1, category: 1 })
presetSchema.index({ user: 1, updatedAt: -1 })

// Статические методы
presetSchema.statics.findByUser = function (userId: string) {
  return this.find({ user: userId }).sort({ category: 1, name: 1 }).lean()
}

presetSchema.statics.findByCategory = function (userId: string, category: string) {
  return this.find({
    user: userId,
    category: category || '',
  })
    .sort({ name: 1 })
    .lean()
}

// Хуки
presetSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    // Убедимся, что имя не пустое
    if (this.name.trim() === '') {
      next(new Error('Preset name cannot be empty'))
    }
  }

  // Обрезаем лишние пробелы
  if (this.isModified('description')) {
    this.description = this.description?.trim()
  }

  if (this.isModified('category')) {
    this.category = this.category?.trim()
  }

  next()
})

// Валидация перед обновлением
presetSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate() as any

  if (update.name && update.name.trim() === '') {
    next(new Error('Preset name cannot be empty'))
  }

  if (update.description) {
    update.description = update.description.trim()
  }

  if (update.category) {
    update.category = update.category.trim()
  }

  next()
})

// Виртуальное поле для отображения
presetSchema.virtual('displayName').get(function () {
  return `${this.name} (${this.category || 'No Category'})`
})

const Preset = mongoose.model<IPreset, IPresetModel>('Preset', presetSchema)

export default Preset
