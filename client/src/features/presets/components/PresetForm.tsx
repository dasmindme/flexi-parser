import React, { useState } from 'react'
import { Button } from '@/shared/ui/Button/Button'
import { Input } from '@/shared/ui/Input/Input'
import { Preset } from '@shared/types'
import styles from './Presets.module.css'
import { FiSave, FiX } from 'react-icons/fi'

interface PresetFormProps {
  preset?: Preset | null
  onSubmit: (data: Omit<Preset, '_id' | 'user' | 'createdAt' | 'updatedAt'>) => void
  onCancel: () => void
}

const DEFAULT_CATEGORIES = ['API', 'GeoJSON', 'JSON', 'Custom', 'Production', 'Development']

export const PresetForm: React.FC<PresetFormProps> = ({ preset, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: preset?.name || '',
    url: preset?.url || '',
    description: preset?.description || '',
    category: preset?.category || '',
  })
  const [customCategory, setCustomCategory] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.url.trim()) {
      newErrors.url = 'URL is required'
    } else {
      try {
        new URL(formData.url)
      } catch {
        newErrors.url = 'Please enter a valid URL'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    const category = customCategory || formData.category

    onSubmit({
      name: formData.name.trim(),
      url: formData.url.trim(),
      description: formData.description.trim(),
      category: category.trim(),
    })
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <Input
        label="Preset Name"
        value={formData.name}
        onChange={e => setFormData({ ...formData, name: e.target.value })}
        placeholder="Enter preset name"
        error={errors.name}
        fullWidth
        required
      />

      <Input
        label="API URL"
        value={formData.url}
        onChange={e => setFormData({ ...formData, url: e.target.value })}
        placeholder="https://api.example.com/data"
        error={errors.url}
        fullWidth
        required
      />

      <div className={styles.formGroup}>
        <label className={styles.label}>Category</label>
        <div className={styles.categorySelector}>
          <select
            value={formData.category}
            onChange={e => setFormData({ ...formData, category: e.target.value })}
            className={styles.select}
          >
            <option value="">Select category</option>
            {DEFAULT_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <span className={styles.or}>or</span>

          <Input
            placeholder="Custom category"
            value={customCategory}
            onChange={e => {
              setCustomCategory(e.target.value)
              setFormData({ ...formData, category: '' })
            }}
            className={styles.customInput}
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Description (optional)</label>
        <textarea
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe this preset..."
          className={styles.textarea}
          rows={3}
          maxLength={500}
        />
        <div className={styles.charCount}>{formData.description.length}/500</div>
      </div>

      <div className={styles.formActions}>
        <Button type="button" variant="outline" onClick={onCancel} leftIcon={<FiX />}>
          Cancel
        </Button>

        <Button type="submit" variant="primary" leftIcon={<FiSave />}>
          {preset ? 'Update Preset' : 'Save Preset'}
        </Button>
      </div>
    </form>
  )
}
