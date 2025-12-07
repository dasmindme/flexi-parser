import React from 'react'
import { Button } from '@/shared/ui/Button/Button'
import { Card } from '@/shared/ui/Card/Card'
import styles from './ResponseViewer.module.css'
import { FiCheck, FiX, FiTrash2, FiDownload, FiMap } from 'react-icons/fi'

interface ResponseViewerProps {
  response: string
  isJsonValid: boolean
  onFormat: () => void
  onValidate: () => void
  onClear: () => void
  onSaveExcel: () => void
  onSaveGeoJSON: (type: 'Point' | 'Line') => void
}

export const ResponseViewer: React.FC<ResponseViewerProps> = ({
  response,
  isJsonValid,
  onFormat,
  onValidate,
  onClear,
  onSaveExcel,
  onSaveGeoJSON
}) => {
  const characterCount = response.length
  const lineCount = response.split('\n').length
  
  return (
    <Card className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>API Response</h3>
        
        <div className={`${styles.jsonStatus} ${isJsonValid ? styles.jsonValid : styles.jsonInvalid}`}>
          {isJsonValid ? (
            <>
              <FiCheck />
              Valid JSON
            </>
          ) : (
            <>
              <FiX />
              Invalid JSON
            </>
          )}
        </div>
      </div>
      
      {response ? (
        <>
          <textarea
            className={styles.textarea}
            value={response}
            readOnly
            placeholder="Response will appear here..."
            rows={15}
          />
          
          <div className={styles.dataInfo}>
            <div className={styles.infoItem}>
              <span className={styles.infoIcon}>📝</span>
              {characterCount} characters
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoIcon}>📄</span>
              {lineCount} lines
            </div>
          </div>
        </>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📄</div>
          <div className={styles.emptyText}>
            No response yet. Send a request or paste JSON to get started.
          </div>
        </div>
      )}
      
      <div className={styles.controls}>
        <Button
          variant="secondary"
          onClick={onFormat}
          disabled={!response}
        >
          Format JSON
        </Button>
        
        <Button
          variant="secondary"
          onClick={onValidate}
          disabled={!response}
        >
          Validate JSON
        </Button>
        
        <Button
          variant="secondary"
          onClick={onClear}
          disabled={!response}
          leftIcon={<FiTrash2 />}
        >
          Clear
        </Button>
      </div>
      
      <div className={styles.exportControls}>
        <div className={styles.exportSection}>
          <h4 className={styles.exportTitle}>Export Options</h4>
          <div className={styles.exportButtons}>
            <Button
              variant="primary"
              onClick={onSaveExcel}
              disabled={!response || !isJsonValid}
              leftIcon={<FiDownload />}
            >
              Save to Excel
            </Button>
            
            <Button
              variant="secondary"
              onClick={() => onSaveGeoJSON('Point')}
              disabled={!response || !isJsonValid}
              leftIcon={<FiMap />}
            >
              Export GeoJSON (Points)
            </Button>
            
            <Button
              variant="secondary"
              onClick={() => onSaveGeoJSON('Line')}
              disabled={!response || !isJsonValid}
              leftIcon={<FiMap />}
            >
              Export GeoJSON (Lines)
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}