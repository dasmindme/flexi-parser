import React, { useState, useEffect } from 'react'
import { useAuth } from '@features/auth/hooks/useAuth'
import { presetsApi } from '@shared/api'
import { Card } from '@/shared/ui/Card/Card'
import { Button } from '@/shared/ui/Button/Button'
import { Modal } from '@/shared/ui/Modal/Modal'
import { PresetForm } from './PresetForm'
import { PresetList } from './PresetList'
import { Preset } from '@shared/types'
import styles from './Presets.module.css'
import { FiPlus, FiGrid, FiList, FiSearch } from 'react-icons/fi'

export const PresetManager = () => {
  const { user } = useAuth()
  const [presets, setPresets] = useState<Preset[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingPreset, setEditingPreset] = useState<Preset | null>(null)

  const loadPresets = async () => {
    if (!user) return
    
    try {
      setIsLoading(true)
      const { data } = await presetsApi.getAll()
      setPresets(data)
    } catch (error) {
      console.error('Failed to load presets:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async (presetData: Omit<Preset, '_id' | 'user' | 'createdAt' | 'updatedAt'>) => {
    try {
      await presetsApi.create(presetData)
      await loadPresets()
      setIsFormOpen(false)
    } catch (error) {
      console.error('Failed to create preset:', error)
    }
  }

  const handleUpdate = async (id: string, presetData: Partial<Preset>) => {
    try {
      await presetsApi.update(id, presetData)
      await loadPresets()
      setIsFormOpen(false)
      setEditingPreset(null)
    } catch (error) {
      console.error('Failed to update preset:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this preset?')) return
    
    try {
      await presetsApi.delete(id)
      await loadPresets()
    } catch (error) {
      console.error('Failed to delete preset:', error)
    }
  }

  const handleEdit = (preset: Preset) => {
    setEditingPreset(preset)
    setIsFormOpen(true)
  }

  // Фильтрация пресетов
  const filteredPresets = presets.filter(preset => {
    const matchesSearch = preset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      preset.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      preset.url.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = !selectedCategory || preset.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  // Получение уникальных категорий
  const categories = Array.from(new Set(presets.map(p => p.category || 'Uncategorized')))

  useEffect(() => {
    loadPresets()
  }, [user])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Preset Manager</h1>
        <p className={styles.subtitle}>Manage your API request presets</p>
      </div>

      <Card className={styles.controls}>
        <div className={styles.search}>
          <input
            type="text"
            placeholder="Search presets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <FiSearch className={styles.searchIcon} />
        </div>

        <div className={styles.filterGroup}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={styles.categorySelect}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category || 'Uncategorized'}
              </option>
            ))}
          </select>

          <div className={styles.viewToggle}>
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              leftIcon={<FiGrid />}
            >
              Grid
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              leftIcon={<FiList />}
            >
              List
            </Button>
          </div>

          <Button
            variant="primary"
            leftIcon={<FiPlus />}
            onClick={() => {
              setEditingPreset(null)
              setIsFormOpen(true)
            }}
          >
            New Preset
          </Button>
        </div>
      </Card>

      {isLoading ? (
        <div className={styles.loading}>
          Loading presets...
        </div>
      ) : (
        <PresetList
          presets={filteredPresets}
          viewMode={viewMode}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <Modal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingPreset(null)
        }}
        title={editingPreset ? 'Edit Preset' : 'Create New Preset'}
        size="lg"
      >
        <PresetForm
          preset={editingPreset}
          onSubmit={editingPreset ? 
            (data) => handleUpdate(editingPreset._id, data) : 
            handleCreate
          }
          onCancel={() => {
            setIsFormOpen(false)
            setEditingPreset(null)
          }}
        />
      </Modal>
    </div>
  )
}