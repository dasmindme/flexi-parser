import React, { useState } from 'react'
import { Modal } from '@/shared/ui/Modal/Modal'
import { Button } from '@/shared/ui/Button/Button'
import styles from './JsonEditor.module.css'
import { FiSave } from 'react-icons/fi'

interface JsonEditorProps {
  isOpen: boolean
  onClose: () => void
  initialValue?: string
  onSave: (value: string) => void
}

export const JsonEditor: React.FC<JsonEditorProps> = ({
  isOpen,
  onClose,
  initialValue = '',
  onSave,
}) => {
  const [jsonInput, setJsonInput] = useState(initialValue)
  const [error, setError] = useState<string | null>(null)

  const handleSave = () => {
    try {
      if (jsonInput.trim()) {
        JSON.parse(jsonInput)
        onSave(jsonInput)
        onClose()
      } else {
        onSave('')
        onClose()
      }
    } catch (err) {
      setError('Invalid JSON format')
    }
  }

  const formatJson = () => {
    try {
      const parsed = JSON.parse(jsonInput)
      setJsonInput(JSON.stringify(parsed, null, 2))
      setError(null)
    } catch (err) {
      setError('Cannot format invalid JSON')
    }
  }

  const loadExample = () => {
    const example = {
      example: {
        data: [
          { id: 1, name: 'Sample', coordinates: { lat: 55.7558, lon: 37.6173 } },
          { id: 2, name: 'Sample 2', coordinates: { lat: 59.9343, lon: 30.3351 } },
        ],
      },
    }
    setJsonInput(JSON.stringify(example, null, 2))
    setError(null)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="JSON Editor" size="xl">
      <div className={styles.editor}>
        <div className={styles.toolbar}>
          <Button variant="secondary" size="sm" onClick={loadExample}>
            Load Example
          </Button>

          <Button variant="secondary" size="sm" onClick={formatJson}>
            Format JSON
          </Button>
        </div>

        <textarea
          className={styles.textarea}
          value={jsonInput}
          onChange={e => {
            setJsonInput(e.target.value)
            setError(null)
          }}
          placeholder="Paste your JSON here..."
          rows={20}
        />

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.actions}>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button variant="primary" leftIcon={<FiSave />} onClick={handleSave}>
            Save JSON
          </Button>
        </div>
      </div>
    </Modal>
  )
}
