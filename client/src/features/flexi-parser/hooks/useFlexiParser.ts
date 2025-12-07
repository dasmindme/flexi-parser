import { useState, useCallback } from 'react'
import { ApiResponse, Preset } from '@shared/types'
import { presetsApi, proxyApi, discoveryApi } from '@shared/api'
import { exportToExcel, exportToGeoJSON } from '@shared/lib/export'

interface UseFlexiParserReturn {
  apiUrl: string
  dataPath: string
  response: string
  isLoading: boolean
  isJsonValid: boolean
  presets: Preset[]
  discoveredEndpoints: any[]

  setApiUrl: (url: string) => void
  setDataPath: (path: string) => void
  setResponse: (response: string) => void

  sendRequest: (url: string, path: string) => Promise<void>
  validateJson: () => boolean
  formatJson: () => void
  saveToExcel: () => void
  saveToGeoJSON: (type: 'Point' | 'Line') => void
  loadPresets: () => Promise<void>
  discoverApi: (siteUrl: string) => Promise<void>
}

export const useFlexiParser = (): UseFlexiParserReturn => {
  const [apiUrl, setApiUrl] = useState('')
  const [dataPath, setDataPath] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isJsonValid, setIsJsonValid] = useState(false)
  const [presets, setPresets] = useState<Preset[]>([])
  const [discoveredEndpoints, setDiscoveredEndpoints] = useState<any[]>([])

  const sendRequest = useCallback(
    async (url: string, path: string) => {
      if (!url.trim() && !response.trim()) {
        alert('Please enter API URL or paste JSON')
        return
      }

      if (url.trim()) {
        try {
          setIsLoading(true)
          const { data } = await proxyApi.request(url)
          setResponse(JSON.stringify(data, null, 2))
          setIsJsonValid(true)
        } catch (error: any) {
          alert(`Error: ${error.message}`)
          setIsJsonValid(false)
        } finally {
          setIsLoading(false)
        }
      }
    },
    [response]
  )

  const validateJson = useCallback(() => {
    if (!response.trim()) {
      setIsJsonValid(false)
      return false
    }

    try {
      JSON.parse(response)
      setIsJsonValid(true)
      return true
    } catch {
      setIsJsonValid(false)
      return false
    }
  }, [response])

  const formatJson = useCallback(() => {
    try {
      const parsed = JSON.parse(response)
      setResponse(JSON.stringify(parsed, null, 2))
      setIsJsonValid(true)
    } catch {
      alert('Invalid JSON format')
    }
  }, [response])

  const saveToExcel = useCallback(() => {
    try {
      const parsed = JSON.parse(response)
      const data = extractData(parsed, dataPath)
      exportToExcel(data)
    } catch (error: any) {
      alert(`Error: ${error.message}`)
    }
  }, [response, dataPath])

  const saveToGeoJSON = useCallback(
    (type: 'Point' | 'Line') => {
      try {
        const parsed = JSON.parse(response)
        const data = extractData(parsed, dataPath)
        exportToGeoJSON(data, type)
      } catch (error: any) {
        alert(`Error: ${error.message}`)
      }
    },
    [response, dataPath]
  )

  const loadPresets = useCallback(async () => {
    try {
      const { data } = await presetsApi.getAll()
      setPresets(data)
    } catch (error) {
      console.error('Failed to load presets:', error)
    }
  }, [])

  const discoverApi = useCallback(async (siteUrl: string) => {
    try {
      const { data } = await discoveryApi.discover(siteUrl)
      setDiscoveredEndpoints(data.endpoints || [])
    } catch (error) {
      console.error('Discovery failed:', error)
    }
  }, [])

  const extractData = (data: any, path: string) => {
    if (!path) return data

    const keys = path.split('.')
    let result = data

    for (const key of keys) {
      if (result[key] !== undefined) {
        result = result[key]
      } else {
        throw new Error(`Path "${path}" not found`)
      }
    }

    return result
  }

  return {
    apiUrl,
    dataPath,
    response,
    isLoading,
    isJsonValid,
    presets,
    discoveredEndpoints,

    setApiUrl,
    setDataPath,
    setResponse,

    sendRequest,
    validateJson,
    formatJson,
    saveToExcel,
    saveToGeoJSON,
    loadPresets,
    discoverApi,
  }
}
