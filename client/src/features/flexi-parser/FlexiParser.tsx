import React, { useState, useEffect } from 'react'
import { Card } from '@shared/ui/Card'
import { Button } from '@shared/ui/Button'
import styles from './FlexiParser.module.css'
import { useFlexiParser } from './hooks/useFlexiParser'
import { ApiRequest } from './components/ApiRequest/ApiRequest'
import { JsonEditor } from './components/JsonEditor/JsonEditor'
import { ResponseViewer } from './components/ResponseViewer/ResponseViewer'
import { InstructionsModal } from './components/InstructionsModal/InstructionsModal'

export const FlexiParser: React.FC = () => {
  const {
    apiUrl,
    dataPath,
    response,
    isLoading,
    isJsonValid,
    sendRequest,
    validateJson,
    formatJson,
    saveToExcel,
    saveToGeoJSON,
    setResponse
  } = useFlexiParser()

  const [isJsonEditorOpen, setIsJsonEditorOpen] = useState(false)
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false)

  useEffect(() => {
    validateJson()
  }, [response, validateJson])

  const handleSendRequest = (url: string, path: string) => {
    sendRequest(url, path)
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>FlexiParser (alpha)</h1>
        <p className={styles.subtitle}>
          Enter API request, specify data path, and get response. Or paste your JSON directly.
        </p>
      </header>

      <main className={styles.main}>
        <ApiRequest
          onSendRequest={handleSendRequest}
          isLoading={isLoading}
          onOpenJsonEditor={() => setIsJsonEditorOpen(true)}
          onOpenInstructions={() => setIsInstructionsOpen(true)}
        />

        <ResponseViewer
          response={response}
          isJsonValid={isJsonValid}
          onFormat={formatJson}
          onValidate={validateJson}
          onClear={() => setResponse('')}
          onSaveExcel={saveToExcel}
          onSaveGeoJSON={saveToGeoJSON}
        />
      </main>

      <JsonEditor
        isOpen={isJsonEditorOpen}
        onClose={() => setIsJsonEditorOpen(false)}
        initialValue={response}
        onSave={setResponse}
      />

      <InstructionsModal
        isOpen={isInstructionsOpen}
        onClose={() => setIsInstructionsOpen(false)}
      />
    </div>
  )
}