import React, { useState, useEffect } from 'react'
import { Button } from '@/shared/ui/Button/Button'
import { Card } from '@/shared/ui/Card/Card'
import { discoveryApi } from '@shared/api'
import styles from './EndpointResult.module.css'
import { FiCheck, FiX, FiClock, FiDatabase, FiExternalLink, FiCopy } from 'react-icons/fi'
import ReactJson from 'react-json-view'

interface EndpointResultProps {
  endpoint: {
    url: string
    type: string
    score: number
    description?: string
  }
  onClose: () => void
  onUse?: () => void
}

interface TestResult {
  success: boolean
  status: number
  contentType: string
  size: number
  structure: string
  data?: any
  headers?: Record<string, string>
  error?: string
}

export const EndpointResult: React.FC<EndpointResultProps> = ({ endpoint, onClose, onUse }) => {
  const [testResult, setTestResult] = useState<TestResult | null>(null)
  const [isTesting, setIsTesting] = useState(false)
  const [copied, setCopied] = useState(false)

  const testEndpoint = async () => {
    setIsTesting(true)
    setTestResult(null)

    try {
      const { data } = await discoveryApi.test(endpoint.url)
      setTestResult(data)
    } catch (error: any) {
      setTestResult({
        success: false,
        status: 0,
        contentType: '',
        size: 0,
        structure: 'error',
        error: error.response?.data?.error || 'Test failed',
      })
    } finally {
      setIsTesting(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return '#10b981' // green
    if (score >= 5) return '#f59e0b' // yellow
    return '#ef4444' // red
  }

  const getStructureIcon = (structure: string) => {
    if (structure.includes('JSON')) return '📄'
    if (structure.includes('XML')) return '📋'
    if (structure.includes('HTML')) return '🌐'
    if (structure.includes('Text')) return '📝'
    return '❓'
  }

  useEffect(() => {
    // Автоматически тестировать эндпоинт при открытии
    testEndpoint()
  }, [endpoint.url])

  return (
    <div className={styles.container}>
      {/* Информация об эндпоинте */}
      <Card className={styles.endpointInfo}>
        <div className={styles.endpointHeader}>
          <div className={styles.endpointType}>
            <span className={styles.typeIcon}>{getStructureIcon(endpoint.type)}</span>
            <span className={styles.typeText}>{endpoint.type}</span>
          </div>

          <div
            className={styles.scoreBadge}
            style={{ backgroundColor: getScoreColor(endpoint.score) }}
          >
            Score: {endpoint.score}
          </div>
        </div>

        <div className={styles.urlSection}>
          <div className={styles.urlHeader}>
            <h4 className={styles.urlTitle}>Endpoint URL</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(endpoint.url)}
              leftIcon={<FiCopy />}
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>

          <div className={styles.urlDisplay}>
            <code className={styles.urlText}>{endpoint.url}</code>
            <a
              href={endpoint.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.urlLink}
            >
              <FiExternalLink />
            </a>
          </div>
        </div>

        {endpoint.description && (
          <div className={styles.description}>
            <h4 className={styles.descriptionTitle}>Description</h4>
            <p className={styles.descriptionText}>{endpoint.description}</p>
          </div>
        )}
      </Card>

      {/* Результаты теста */}
      <Card className={styles.testSection}>
        <div className={styles.testHeader}>
          <h3 className={styles.testTitle}>{isTesting ? 'Testing Endpoint...' : 'Test Results'}</h3>

          <Button
            variant="outline"
            size="sm"
            onClick={testEndpoint}
            disabled={isTesting}
            leftIcon={isTesting ? <FiClock /> : null}
          >
            {isTesting ? 'Testing...' : 'Retest'}
          </Button>
        </div>

        {isTesting ? (
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <p>Testing endpoint: {endpoint.url}</p>
          </div>
        ) : testResult ? (
          <div className={styles.testResults}>
            {/* Статус теста */}
            <div
              className={`${styles.statusCard} ${testResult.success ? styles.success : styles.error}`}
            >
              <div className={styles.statusIcon}>{testResult.success ? <FiCheck /> : <FiX />}</div>
              <div className={styles.statusInfo}>
                <h4 className={styles.statusTitle}>
                  {testResult.success ? 'Test Successful' : 'Test Failed'}
                </h4>
                <p className={styles.statusText}>
                  HTTP {testResult.status} • {testResult.structure}
                </p>
              </div>
            </div>

            {/* Детали теста */}
            <div className={styles.testDetails}>
              <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Status Code</span>
                  <span
                    className={`${styles.detailValue} ${testResult.status >= 400 ? styles.errorText : styles.successText}`}
                  >
                    {testResult.status}
                  </span>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Content Type</span>
                  <span className={styles.detailValue}>{testResult.contentType || 'Unknown'}</span>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Size</span>
                  <span className={styles.detailValue}>
                    {(testResult.size / 1024).toFixed(2)} KB
                  </span>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Structure</span>
                  <span className={styles.detailValue}>
                    <span className={styles.structureIcon}>
                      {getStructureIcon(testResult.structure)}
                    </span>
                    {testResult.structure}
                  </span>
                </div>
              </div>

              {/* Preview данных */}
              {testResult.data && (
                <div className={styles.dataPreview}>
                  <h4 className={styles.previewTitle}>Data Preview</h4>
                  <div className={styles.previewContainer}>
                    <ReactJson
                      src={testResult.data}
                      theme="solarized"
                      collapsed={2}
                      displayDataTypes={false}
                      style={{
                        padding: '1rem',
                        borderRadius: '0.5rem',
                        backgroundColor: 'var(--background-color)',
                        fontSize: '0.85rem',
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Headers */}
              {testResult.headers && Object.keys(testResult.headers).length > 0 && (
                <div className={styles.headersSection}>
                  <h4 className={styles.headersTitle}>Response Headers</h4>
                  <div className={styles.headersList}>
                    {Object.entries(testResult.headers).map(([key, value]) => (
                      <div key={key} className={styles.headerItem}>
                        <span className={styles.headerKey}>{key}:</span>
                        <span className={styles.headerValue}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ошибка */}
              {testResult.error && (
                <div className={styles.errorSection}>
                  <h4 className={styles.errorTitle}>Error Details</h4>
                  <pre className={styles.errorText}>{testResult.error}</pre>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className={styles.noResults}>
            <p>No test results available. Click "Test" to test the endpoint.</p>
          </div>
        )}
      </Card>

      {/* Действия */}
      <div className={styles.actions}>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>

        {onUse ? (
          <Button
            variant="primary"
            onClick={() => {
              onUse()
              onClose()
            }}
            leftIcon={<FiDatabase />}
          >
            Use This Endpoint
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={() => {
              console.log('Using endpoint:', endpoint.url)
              alert(`Endpoint ${endpoint.url} will be used in the parser`)
              onClose()
            }}
            leftIcon={<FiDatabase />}
          >
            Use This Endpoint
          </Button>
        )}
      </div>
    </div>
  )
}
