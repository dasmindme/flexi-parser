import { Request, Response } from 'express'
import axios from 'axios'
import cheerio from 'cheerio'
import * as XLSX from 'xlsx'
import { URL } from 'url'

// Интерфейсы
interface DiscoveredEndpoint {
  url: string
  type: string
  score: number
  description?: string
}

// Прокси запрос
export const proxyRequest = async (req: Request, res: Response) => {
  try {
    const { url } = req.query

    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'URL is required' })
    }

    let parsedUrl: URL
    try {
      parsedUrl = new URL(url)
    } catch {
      return res.status(400).json({ error: 'Invalid URL' })
    }

    const blockedHosts = [
      'localhost', '127.0.0.1', '0.0.0.0', '::1', '192.168.', '10.', '172.16.',
      '172.17.', '172.18.', '172.19.', '172.20.', '172.21.', '172.22.', '172.23.',
      '172.24.', '172.25.', '172.26.', '172.27.', '172.28.', '172.29.', '172.30.',
      '172.31.', '169.254.'
    ]

    const hostname = parsedUrl.hostname.toLowerCase()
    if (blockedHosts.some(blocked => hostname.includes(blocked))) {
      return res.status(403).json({ error: 'Access to local resources is forbidden' })
    }

    const response = await axios({
      method: req.method,
      url: parsedUrl.toString(),
      headers: {
        ...req.headers,
        host: parsedUrl.host,
        origin: parsedUrl.origin,
        referer: parsedUrl.origin,
        'user-agent': 'FlexiParser/1.0'
      },
      params: req.query,
      data: req.body,
      responseType: 'stream',
      timeout: 30000,
      maxRedirects: 5,
      validateStatus: () => true
    })

    res.status(response.status)
    
    const headersToExclude = ['connection', 'keep-alive', 'transfer-encoding', 'content-encoding']
    
    Object.entries(response.headers).forEach(([key, value]) => {
      if (!headersToExclude.includes(key.toLowerCase())) {
        res.setHeader(key, value as string)
      }
    })

    response.data.pipe(res)
  } catch (error: any) {
    console.error('Proxy request error:', error)
    
    if (error.code === 'ECONNREFUSED') {
      return res.status(502).json({ error: 'Connection refused' })
    }
    
    if (error.code === 'ETIMEDOUT') {
      return res.status(504).json({ error: 'Request timeout' })
    }
    
    res.status(500).json({ 
      error: 'Proxy request failed', 
      message: error.message 
    })
  }
}

// Discovery API
export const discoverApi = async (req: Request, res: Response) => {
  try {
    const { url } = req.body

    if (!url) {
      return res.status(400).json({ error: 'URL is required' })
    }

    // Валидация URL
    let parsedUrl: URL
    try {
      parsedUrl = new URL(url)
    } catch {
      return res.status(400).json({ error: 'Invalid URL' })
    }

    // Получение HTML страницы
    const response = await axios.get(parsedUrl.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      timeout: 10000,
      validateStatus: () => true // Принимаем любые статусы
    })

    // Проверка, что получили HTML
    if (!response.data || typeof response.data !== 'string') {
      return res.json({ 
        success: true, 
        endpoints: [],
        count: 0,
        message: 'No HTML content found'
      })
    }

    // Загружаем HTML в cheerio
    let $
    try {
      $ = cheerio.load(response.data)
    } catch (error) {
      return res.json({ 
        success: true, 
        endpoints: [],
        count: 0,
        message: 'Failed to parse HTML'
      })
    }
    const endpoints: DiscoveredEndpoint[] = []

    const findEndpoints = (text: string) => {
      const patterns = [
        /(?:fetch|axios|ajax|XMLHttpRequest)\s*\(\s*['"]([^'"]*\/api\/[^'"]*)['"]/gi,
        /(?:fetch|axios|ajax|XMLHttpRequest)\s*\(\s*['"]([^'"]*\.json[^'"]*)['"]/gi,
        /(?:query|mutation)\s*[^{]+\{\s*[^}]*\s*\}\s*['"]([^'"]*)['"]/gi,
        /(?:new\s+WebSocket|ws:\/\/|wss:\/\/)\s*\(\s*['"]([^'"]*)['"]/gi
      ]

      patterns.forEach(pattern => {
        let match
        while ((match = pattern.exec(text)) !== null) {
          let endpointUrl = match[1]
          if (!endpointUrl.startsWith('http')) {
            endpointUrl = new URL(endpointUrl, parsedUrl).href
          }
          
          endpoints.push({
            url: endpointUrl,
            type: pattern.toString().includes('json') ? 'JSON API' : 'API Endpoint',
            score: 7
          })
        }
      })
    }

    $('script[src]').each((i, el) => {
      const src = $(el).attr('src')
      if (src && (src.includes('api') || src.includes('json'))) {
        endpoints.push({
          url: new URL(src, parsedUrl).href,
          type: 'JS API',
          score: 6
        })
      }
    })

    $('script:not([src])').each((i, el) => {
      findEndpoints($(el).text())
    })

    $('a[href]').each((i, el) => {
      const href = $(el).attr('href')
      if (href && (href.includes('api') || href.includes('json'))) {
        endpoints.push({
          url: new URL(href, parsedUrl).href,
          type: 'API Link',
          score: 5
        })
      }
    })

    const uniqueEndpoints = endpoints.filter((endpoint, index, self) =>
      index === self.findIndex(e => e.url === endpoint.url)
    )

    // Сортировка по score
    uniqueEndpoints.sort((a, b) => b.score - a.score)

    res.json({ 
      success: true, 
      endpoints: uniqueEndpoints,
      count: uniqueEndpoints.length
    })
  } catch (error: any) {
    console.error('API discovery error:', error)
    
    // Более детальные ошибки
    if (error.code === 'ENOTFOUND') {
      return res.status(400).json({ 
        success: false, 
        error: 'Domain not found' 
      })
    }
    
    if (error.code === 'ECONNREFUSED') {
      return res.status(400).json({ 
        success: false, 
        error: 'Connection refused' 
      })
    }
    
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Discovery failed'
    })
  }
}

// Test endpoint
export const testEndpoint = async (req: Request, res: Response) => {
  try {
    const { url } = req.body

    if (!url) {
      return res.status(400).json({ error: 'URL is required' })
    }

    // Валидация URL
    try {
      new URL(url)
    } catch {
      return res.status(400).json({ error: 'Invalid URL' })
    }

    const response = await axios.get(url, {
      timeout: 5000,
      validateStatus: () => true
    })

    const contentType = response.headers['content-type'] || ''
    const isJson = contentType.includes('application/json')
    
    let structure = 'unknown'
    let dataPreview = null

    if (isJson) {
      try {
        const jsonData = response.data
        if (Array.isArray(jsonData)) {
          structure = `JSON array with ${jsonData.length} items`
          dataPreview = jsonData.slice(0, 5)
        } else if (typeof jsonData === 'object') {
          const keys = Object.keys(jsonData)
          structure = `JSON object with ${keys.length} keys`
          dataPreview = jsonData
        }
      } catch {
        structure = 'Invalid JSON'
      }
    } else if (contentType.includes('text/html')) {
      structure = 'HTML'
    } else if (contentType.includes('text/xml') || contentType.includes('application/xml')) {
      structure = 'XML'
    } else if (contentType.includes('text/plain')) {
      structure = 'Text'
    }

    res.json({
      success: response.status >= 200 && response.status < 300,
      status: response.status,
      contentType,
      size: response.data ? Buffer.byteLength(JSON.stringify(response.data)) : 0,
      structure,
      data: dataPreview || response.data,
      headers: response.headers
    })
  } catch (error: any) {
    console.error('Test endpoint error:', error)
    
    // Обработка ошибок сети
    if (error.code === 'ENOTFOUND') {
      return res.json({
        success: false,
        status: 0,
        contentType: '',
        size: 0,
        structure: 'error',
        error: 'Domain not found'
      })
    }
    
    if (error.code === 'ECONNREFUSED') {
      return res.json({
        success: false,
        status: 0,
        contentType: '',
        size: 0,
        structure: 'error',
        error: 'Connection refused'
      })
    }
    
    res.json({
      success: false,
      status: 0,
      contentType: '',
      size: 0,
      structure: 'error',
      error: error.message || 'Test failed'
    })
  }
}

// Validate JSON
export const validateJson = async (req: Request, res: Response) => {
  try {
    const { json } = req.body

    if (!json) {
      return res.status(400).json({ error: 'JSON is required' })
    }

    try {
      const parsed = JSON.parse(json)
      res.json({
        valid: true,
        type: Array.isArray(parsed) ? 'array' : 'object',
        length: Array.isArray(parsed) ? parsed.length : Object.keys(parsed).length
      })
    } catch (error: any) {
      res.json({
        valid: false,
        error: error.message,
        position: error.position
      })
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

// Export to Excel
export const exportToExcel = async (req: Request, res: Response) => {
  try {
    const { data, filename = 'export.xlsx' } = req.body

    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ error: 'Valid data array is required' })
    }

    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(data)
    XLSX.utils.book_append_sheet(wb, ws, 'Data')

    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.send(buffer)
  } catch (error: any) {
    console.error('Export to Excel error:', error)
    res.status(500).json({ error: error.message })
  }
}

// Export to GeoJSON
export const exportToGeoJSON = async (req: Request, res: Response) => {
  try {
    const { data, type = 'Point', filename = 'export.geojson' } = req.body

    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ error: 'Valid data array is required' })
    }

    const features = data.map((item, index) => {
      let coordinates: [number, number] | [number, number][] = [0, 0]
      
      if (type === 'Point') {
        if (item.lat !== undefined && item.lng !== undefined) {
          coordinates = [item.lng, item.lat]
        } else if (item.latitude !== undefined && item.longitude !== undefined) {
          coordinates = [item.longitude, item.latitude]
        } else if (item.coordinates && Array.isArray(item.coordinates)) {
          coordinates = [item.coordinates[1], item.coordinates[0]]
        }
      } else if (type === 'LineString') {
        if (item.ordinates && Array.isArray(item.ordinates)) {
          coordinates = item.ordinates.map((coord: any) => [coord.lng || coord.longitude, coord.lat || coord.latitude])
        }
      }

      const properties = { ...item }
      delete properties.lat
      delete properties.lng
      delete properties.latitude
      delete properties.longitude
      delete properties.coordinates
      delete properties.ordinates

      return {
        type: 'Feature',
        geometry: {
          type: type === 'Point' ? 'Point' : 'LineString',
          coordinates: type === 'Point' ? coordinates : [coordinates]
        },
        properties
      }
    })

    const geojson = {
      type: 'FeatureCollection',
      features: features.filter((f: any) => 
        f.geometry.coordinates[0] !== 0 || f.geometry.coordinates[1] !== 0
      )
    }

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    res.setHeader('Content-Type', 'application/geo+json')
    res.json(geojson)
  } catch (error: any) {
    console.error('Export to GeoJSON error:', error)
    res.status(500).json({ error: error.message })
  }
}

// Экспорт всех функций
export default {
  proxyRequest,
  discoverApi,
  testEndpoint,
  validateJson,
  exportToExcel,
  exportToGeoJSON
}