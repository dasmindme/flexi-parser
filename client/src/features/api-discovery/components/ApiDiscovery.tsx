import React, { useState } from 'react'
import { Card } from '@/shared/ui/Card/Card'
import { Button } from '@/shared/ui/Button/Button'
import { Input } from '@/shared/ui/Input/Input'
import { Modal } from '@/shared/ui/Modal/Modal'
import { discoveryApi } from '@shared/api'
import { EndpointResult } from './EndpointResult'
import styles from './ApiDiscovery.module.css'
import { FiSearch, FiGlobe, FiList, FiAlertCircle } from 'react-icons/fi'

interface DiscoveredEndpoint {
  url: string
  type: string
  score: number
  description?: string
}

// Добавляем пропс onSelectEndpoint в интерфейс
interface ApiDiscoveryProps {
  onSelectEndpoint?: (url: string) => void
}

export const ApiDiscovery: React.FC<ApiDiscoveryProps> = ({ onSelectEndpoint }) => {
  const [siteUrl, setSiteUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [endpoints, setEndpoints] = useState<DiscoveredEndpoint[]>([])
  const [error, setError] = useState('')
  const [selectedEndpoint, setSelectedEndpoint] = useState<DiscoveredEndpoint | null>(null)
  const [isResultModalOpen, setIsResultModalOpen] = useState(false)

  const discover = async () => {
    if (!siteUrl.trim()) {
      setError('Please enter a website URL')
      return
    }

    try {
      new URL(siteUrl)
    } catch {
      setError('Please enter a valid URL')
      return
    }

    setIsLoading(true)
    setError('')
    setEndpoints([])

    try {
      const { data } = await discoveryApi.discover(siteUrl)
      setEndpoints(data.endpoints || [])
    } catch (err: any) {
      setError(err.response?.data?.error || 'Discovery failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTestEndpoint = (endpoint: DiscoveredEndpoint) => {
    setSelectedEndpoint(endpoint)
    setIsResultModalOpen(true)
  }

  const handleUseEndpoint = (url: string) => {
    // Вызываем коллбек onSelectEndpoint, если он передан
    if (onSelectEndpoint) {
      onSelectEndpoint(url)
    } else {
      // Старая логика на случай, если компонент используется без пропса
      console.log('Using endpoint:', url)
      alert(`Endpoint ${url} will be used in the parser`)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return '#10b981' // green
    if (score >= 5) return '#f59e0b' // yellow
    return '#ef4444' // red
  }

  return (
    <div className={styles.container}>
      <Card className={styles.discoveryCard}>
        <div className={styles.header}>
          <div className={styles.headerIcon}>
            <FiGlobe />
          </div>
          <div>
            <h2 className={styles.title}>API Discovery</h2>
            <p className={styles.subtitle}>
              Automatically discover API endpoints on websites
            </p>
          </div>
        </div>

        <div className={styles.inputSection}>
          <Input
            label="Website URL"
            type="url"
            value={siteUrl}
            onChange={(e) => setSiteUrl(e.target.value)}
            placeholder="https://example.com"
            fullWidth
            leftIcon={<FiGlobe />}
            error={error}
          />
          
          <Button
            variant="primary"
            onClick={discover}
            isLoading={isLoading}
            leftIcon={<FiSearch />}
            className={styles.discoverButton}
          >
            Discover APIs
          </Button>
        </div>

        {endpoints.length > 0 && (
          <div className={styles.resultsSection}>
            <div className={styles.resultsHeader}>
              <h3 className={styles.resultsTitle}>
                <FiList /> Found {endpoints.length} endpoints
              </h3>
            </div>
            
            <div className={styles.endpointsList}>
              {endpoints.map((endpoint, index) => (
                <Card key={index} className={styles.endpointCard}>
                  <div className={styles.endpointHeader}>
                    <div className={styles.endpointType}>
                      {endpoint.type}
                    </div>
                    <div 
                      className={styles.scoreBadge}
                      style={{ backgroundColor: getScoreColor(endpoint.score) }}
                    >
                      Score: {endpoint.score}
                    </div>
                  </div>
                  
                  <div className={styles.endpointUrl}>
                    {endpoint.url}
                  </div>
                  
                  <div className={styles.endpointActions}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTestEndpoint(endpoint)}
                    >
                      Test
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleUseEndpoint(endpoint.url)}
                    >
                      Use
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {endpoints.length === 0 && !isLoading && !error && (
          <div className={styles.emptyState}>
            <FiAlertCircle className={styles.emptyIcon} />
            <h3>No endpoints discovered yet</h3>
            <p>Enter a website URL and click "Discover APIs" to find API endpoints</p>
          </div>
        )}
      </Card>

      <Modal
        isOpen={isResultModalOpen}
        onClose={() => setIsResultModalOpen(false)}
        title="Test Endpoint"
        size="lg"
      >
        {selectedEndpoint && (
          <EndpointResult
            endpoint={selectedEndpoint}
            onClose={() => setIsResultModalOpen(false)}
            onUse={() => handleUseEndpoint(selectedEndpoint.url)} // Добавляем обработку использования из модального окна
          />
        )}
      </Modal>
    </div>
  )
}