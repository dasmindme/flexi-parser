import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'

export const register = async (req: Request, res: Response) => {
  try {
    // Упрощенная регистрация без базы данных
    const { username, email } = req.body

    // Создаем простой токен
    const token = jwt.sign(
      { userId: '1', username: username || 'user' },
      process.env.JWT_SECRET || 'secret-key',
      { expiresIn: '7d' }
    )

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.status(201).json({
      success: true,
      user: {
        id: 1,
        username: username || 'user',
        email: email || 'test@example.com',
      },
    })
  } catch (error: any) {
    console.error('Registration error:', error)
    res.status(500).json({ error: error.message })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { username } = req.body

    const token = jwt.sign(
      { userId: '1', username: username || 'user' },
      process.env.JWT_SECRET || 'secret-key',
      { expiresIn: '7d' }
    )

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.json({
      success: true,
      user: {
        id: 1,
        username: username || 'user',
        email: 'test@example.com',
      },
    })
  } catch (error: any) {
    console.error('Login error:', error)
    res.status(500).json({ error: error.message })
  }
}

export const logout = (req: Request, res: Response) => {
  res.clearCookie('token')
  res.json({ success: true })
}

export const checkAuth = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      return res.json({ authenticated: false, user: null })
    }

    // Упрощенная проверка токена
    res.json({
      authenticated: true,
      user: {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
      },
    })
  } catch (error) {
    res.json({ authenticated: false, user: null })
  }
}

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const token = jwt.sign(
      { userId: '1', username: 'user' },
      process.env.JWT_SECRET || 'secret-key',
      { expiresIn: '7d' }
    )

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.json({ success: true })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
