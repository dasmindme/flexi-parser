import React from 'react'
import { Card } from '@/shared/ui/Card/Card'
import { Button } from '@/shared/ui/Button/Button'
import { Preset } from '@shared/types'
import styles from './Presets.module.css'
import { FiEdit, FiTrash2, FiCopy, FiExternalLink } from 'react-icons/fi'
import { format } from 'date-fns'

interface PresetListProps {
  presets: Preset[]
  viewMode: 'grid' | 'list'
  onEdit: (preset: Preset) => void
  onDelete: (id: string) => void
}

export const PresetList: React.FC<PresetListProps> = ({ presets, viewMode, onEdit, onDelete }) => {
  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
  }

  if (presets.length === 0) {
    return (
      <Card className={styles.empty}>
        <div className={styles.emptyIcon}>📁</div>
        <h3>No presets found</h3>
        <p>Create your first preset to get started</p>
      </Card>
    )
  }

  if (viewMode === 'grid') {
    return (
      <div className={styles.grid}>
        {presets.map(preset => (
          <Card key={preset._id} className={styles.gridCard}>
            <div className={styles.cardHeader}>
              <h4 className={styles.cardTitle}>{preset.name}</h4>
              {preset.category && <span className={styles.categoryBadge}>{preset.category}</span>}
            </div>

            {preset.description && <p className={styles.cardDescription}>{preset.description}</p>}

            <div className={styles.cardUrl}>
              <a
                href={preset.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.urlLink}
              >
                {preset.url}
              </a>
            </div>

            <div className={styles.cardMeta}>
              <span className={styles.metaItem}>
                Created: {format(new Date(preset.createdAt), 'MMM d, yyyy')}
              </span>
            </div>

            <div className={styles.cardActions}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopyUrl(preset.url)}
                leftIcon={<FiCopy />}
              >
                Copy URL
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(preset)}
                leftIcon={<FiEdit />}
              >
                Edit
              </Button>

              <Button
                variant="danger"
                size="sm"
                onClick={() => onDelete(preset._id)}
                leftIcon={<FiTrash2 />}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className={styles.list}>
      {presets.map(preset => (
        <Card key={preset._id} className={styles.listCard}>
          <div className={styles.listItem}>
            <div className={styles.listContent}>
              <div className={styles.listHeader}>
                <h4 className={styles.listTitle}>{preset.name}</h4>
                {preset.category && <span className={styles.listCategory}>{preset.category}</span>}
              </div>

              {preset.description && <p className={styles.listDescription}>{preset.description}</p>}

              <div className={styles.listUrl}>
                <a
                  href={preset.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.urlLink}
                >
                  {preset.url}
                </a>
              </div>

              <div className={styles.listMeta}>
                <span className={styles.metaItem}>
                  Created: {format(new Date(preset.createdAt), 'MMM d, yyyy')}
                </span>
                <span className={styles.metaItem}>
                  Updated: {format(new Date(preset.updatedAt), 'MMM d, yyyy')}
                </span>
              </div>
            </div>

            <div className={styles.listActions}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopyUrl(preset.url)}
                leftIcon={<FiExternalLink />}
                title="Open URL"
              />

              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(preset)}
                leftIcon={<FiEdit />}
                title="Edit"
              />

              <Button
                variant="danger"
                size="sm"
                onClick={() => onDelete(preset._id)}
                leftIcon={<FiTrash2 />}
                title="Delete"
              />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
