import React, { useState } from 'react'
import { Card } from '@/shared/ui/Card/Card'
import { Button } from '@/shared/ui/Button/Button'
import { Input } from '@/shared/ui/Input/Input'
import styles from './ApiRequest.module.css'
import { FiSend, FiCode, FiHelpCircle } from 'react-icons/fi'
import { PresetSelector } from '../PresetSelector/PresetSelector'
import { ApiDiscovery } from '@/features/api-discovery/components/ApiDiscovery'

interface ApiRequestProps {
  onSendRequest: (url: string, dataPath: string) => void
  isLoading: boolean
  onOpenJsonEditor: () => void
  onOpenInstructions: () => void
}

export const ApiRequest: React.FC<ApiRequestProps> = ({
  onSendRequest,
  isLoading,
  onOpenJsonEditor,
  onOpenInstructions
}) => {
  const [apiUrl, setApiUrl] = useState('')
  const [dataPath, setDataPath] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSendRequest(apiUrl, dataPath)
  }

  const handlePresetSelect = (url: string) => {
    setApiUrl(url)
    setDataPath('')
  }

  return (
    <Card className={styles.container}>
      <form onSubmit={handleSubmit}>
        <div className={styles.section}>
          <h3 className={styles.title}>API Configuration</h3>
          
          <div className={styles.formGroup}>
            <Input
              label="API URL"
              type="url"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="https://api.example.com/data"
              fullWidth
            />
          </div>
          
          <div className={styles.formGroup}>
            <Input
              label="Data Path (optional)"
              value={dataPath}
              onChange={(e) => setDataPath(e.target.value)}
              placeholder="data.items or leave empty for root"
              helperText="Leave empty if data is at root level"
              fullWidth
            />
          </div>
          
          <div className={styles.actions}>
            <Button
              type="submit"
              variant="primary"
              leftIcon={<FiSend />}
              isLoading={isLoading}
              fullWidth
            >
              Send Request
            </Button>
            
            <Button
              type="button"
              variant="secondary"
              leftIcon={<FiCode />}
              onClick={onOpenJsonEditor}
            >
              Paste JSON
            </Button>
            
            <Button
              type="button"
              variant="outline"
              leftIcon={<FiHelpCircle />}
              onClick={onOpenInstructions}
            >
              Help
            </Button>
          </div>
        </div>
        
        <div className={styles.section}>
          <PresetSelector onSelect={handlePresetSelect} />
        </div>
        
        <div className={styles.section}>
          <ApiDiscovery onSelectEndpoint={setApiUrl} />
        </div>
      </form>
    </Card>
  )
}