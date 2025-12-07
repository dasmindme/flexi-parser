import { useState, useEffect, useCallback } from 'react'
import { authApi } from '@shared/api'
import { useNavigate } from 'react-router-dom'

interface User {
  id: string
  username: string
  email?: string
}

interface AuthState {
  user: User | null
  isLoading: boolean
}

interface LoginCredentials {
  username: string
  password: string
}

interface RegisterData {
  username: string
  email?: string
  password: string
}

export const useAuth = () => {
  const navigate = useNavigate()
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
  })

  const checkAuth = useCallback(async () => {
    try {
      const { data } = await authApi.check()
      if (data.authenticated && data.user) {
        setState({ user: data.user, isLoading: false })
      } else {
        setState({ user: null, isLoading: false })
      }
    } catch {
      setState({ user: null, isLoading: false })
    }
  }, [])

  const login = useCallback(async (credentials: LoginCredentials) => {
    const { data } = await authApi.login(credentials)
    if (data.success && data.user) {
      setState({ user: data.user, isLoading: false })
    }
    return data
  }, [])

  const register = useCallback(
    async (data: RegisterData) => {
      const response = await authApi.register(data)
      if (response.data.success) {
        await checkAuth()
      }
      return response.data
    },
    [checkAuth]
  )

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
      setState({ user: null, isLoading: false })
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }, [navigate])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return {
    user: state.user,
    isLoading: state.isLoading,
    login,
    register,
    logout,
    checkAuth,
  }
}
