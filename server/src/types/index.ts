export interface User {
  _id: string
  username: string
  password: string
  email?: string
  createdAt: Date
}

export interface Preset {
  _id: string
  name: string
  url: string
  description?: string
  category?: string
  user: string
  createdAt: Date
  updatedAt: Date
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

export interface RequestUser {
  userId: string
  username: string
}

declare global {
  namespace Express {
    interface Request {
      user?: RequestUser
    }
  }
}