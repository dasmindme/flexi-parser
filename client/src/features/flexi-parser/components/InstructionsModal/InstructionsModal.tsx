import React from 'react'
import { Modal } from '@/shared/ui/Modal/Modal'
import { Button } from '@/shared/ui/Button/Button'
import styles from './InstructionsModal.module.css'
import {
  FiGlobe,
  FiCode,
  FiDownload,
  FiDatabase,
  FiSearch,
  FiSettings,
  FiPlay,
  FiCopy,
  FiCheckSquare,
  FiMap,
} from 'react-icons/fi'

interface InstructionsModalProps {
  isOpen: boolean
  onClose: () => void
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({ isOpen, onClose }) => {
  const sections = [
    {
      title: 'Getting Started',
      icon: <FiPlay />,
      steps: [
        'Enter an API URL or use a preset',
        'Optionally specify a data path (e.g., data.items)',
        'Click "Send Request" or paste JSON directly',
        'View and validate the response',
      ],
    },
    {
      title: 'JSON Operations',
      icon: <FiCode />,
      steps: [
        'Format JSON for better readability',
        'Validate JSON structure',
        'Copy JSON to clipboard',
        'Load example JSON for testing',
      ],
    },
    {
      title: 'Export Options',
      icon: <FiDownload />,
      steps: [
        'Export to Excel (.xlsx)',
        'Export to GeoJSON (Points)',
        'Export to GeoJSON (Lines)',
        'Automatic data flattening',
      ],
    },
    {
      title: 'Preset Management',
      icon: <FiDatabase />,
      steps: [
        'Save frequently used API endpoints',
        'Organize presets by categories',
        'Quick access to saved requests',
        'Edit or delete existing presets',
      ],
    },
    {
      title: 'API Discovery',
      icon: <FiSearch />,
      steps: [
        'Discover API endpoints on websites',
        'Test endpoints before using',
        'Score endpoints by reliability',
        'One-click import to parser',
      ],
    },
    {
      title: 'Advanced Features',
      icon: <FiSettings />,
      steps: [
        'JSON path extraction',
        'Automatic coordinate detection',
        'Data transformation',
        'Batch processing',
      ],
    },
  ]

  const keyboardShortcuts = [
    { key: 'Ctrl + S', description: 'Save to Excel' },
    { key: 'Ctrl + F', description: 'Format JSON' },
    { key: 'Ctrl + K', description: 'Clear response' },
    { key: 'Ctrl + Enter', description: 'Send request' },
    { key: 'Ctrl + Shift + J', description: 'JSON editor' },
  ]

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="FlexiParser Instructions" size="xl">
      <div className={styles.container}>
        {/* Introduction */}
        <div className={styles.intro}>
          <h3 className={styles.introTitle}>Welcome to FlexiParser!</h3>
          <p className={styles.introText}>
            FlexiParser is a powerful API testing and data extraction tool that helps you work with
            JSON APIs, discover endpoints, and export data in multiple formats.
          </p>
        </div>

        {/* Main Sections */}
        <div className={styles.sectionsGrid}>
          {sections.map((section, index) => (
            <div key={index} className={styles.section}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionIcon}>{section.icon}</div>
                <h4 className={styles.sectionTitle}>{section.title}</h4>
              </div>
              <ul className={styles.stepsList}>
                {section.steps.map((step, stepIndex) => (
                  <li key={stepIndex} className={styles.step}>
                    <FiCheckSquare className={styles.checkIcon} />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Keyboard Shortcuts */}
        <div className={styles.shortcutsSection}>
          <h4 className={styles.shortcutsTitle}>
            <FiCopy /> Keyboard Shortcuts
          </h4>
          <div className={styles.shortcutsGrid}>
            {keyboardShortcuts.map((shortcut, index) => (
              <div key={index} className={styles.shortcut}>
                <kbd className={styles.key}>{shortcut.key}</kbd>
                <span className={styles.description}>{shortcut.description}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Examples */}
        <div className={styles.examplesSection}>
          <h4 className={styles.examplesTitle}>
            <FiCode /> Example JSON Structures
          </h4>
          <div className={styles.examples}>
            <div className={styles.example}>
              <h5>Basic API Response</h5>
              <pre className={styles.code}>
                {`{
  "status": "success",
  "data": {
    "items": [
      {
        "id": 1,
        "name": "Item 1",
        "coordinates": {
          "lat": 55.7558,
          "lon": 37.6173
        }
      }
    ]
  }
}`}
              </pre>
            </div>
            <div className={styles.example}>
              <h5>GeoJSON Format</h5>
              <pre className={styles.code}>
                {`{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [37.6173, 55.7558]
      },
      "properties": {
        "name": "Location"
      }
    }
  ]
}`}
              </pre>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className={styles.tipsSection}>
          <h4 className={styles.tipsTitle}>
            <FiSettings /> Pro Tips
          </h4>
          <div className={styles.tips}>
            <div className={styles.tip}>
              <strong>Path Extraction:</strong> Use dot notation to access nested data (e.g.,
              data.items.0.name)
            </div>
            <div className={styles.tip}>
              <strong>Auto-detection:</strong> The parser automatically detects coordinates in
              various formats
            </div>
            <div className={styles.tip}>
              <strong>Bulk Operations:</strong> Use presets for batch processing multiple APIs
            </div>
            <div className={styles.tip}>
              <strong>Error Handling:</strong> Invalid JSON is highlighted with detailed error
              messages
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <Button variant="outline" onClick={onClose}>
            Close Instructions
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              // Действие для быстрого старта
              onClose()
              // Здесь можно добавить логику для открытия основного парсера
            }}
            leftIcon={<FiPlay />}
          >
            Get Started
          </Button>
        </div>
      </div>
    </Modal>
  )
}
