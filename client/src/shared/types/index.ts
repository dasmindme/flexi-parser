export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

export interface Preset {
  _id: string
  name: string
  url: string
  description?: string
  category?: string
  user: string
  createdAt: string
  updatedAt: string
}

export interface ApiEndpoint {
  url: string
  type: string
  score: number
}

export interface TestResult {
  success: boolean
  status: number
  contentType: string
  size: number
  structure: string
  data?: any
}

export interface User {
  username: string
  email?: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
}

export interface JsonEditorProps {
  initialValue?: string
  onSave: (json: string) => void
  onClose: () => void
}

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline';

export type ButtonSize = 'sm' | 'md' | 'lg';