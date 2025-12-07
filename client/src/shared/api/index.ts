import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Auth API
export const authApi = {
  login: (credentials: { username: string; password: string }) =>
    api.post('/auth/login', credentials),
  register: (data: { username: string; password: string; email?: string }) =>
    api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  check: () => api.get('/auth/check')
}

// Presets API
export const presetsApi = {
  getAll: () => api.get('/presets'),
  create: (data: any) => api.post('/presets', data),
  update: (id: string, data: any) => api.put(`/presets/${id}`, data),
  delete: (id: string) => api.delete(`/presets/${id}`)
}

// Proxy API
export const proxyApi = {
  request: (url: string) => api.get(`/proxy?url=${encodeURIComponent(url)}`)
}

// Discovery API
export const discoveryApi = {
  discover: (url: string) => api.post('/discover', { url }),
  test: (url: string) => api.post('/test-endpoint', { url })
}

// Interceptors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)