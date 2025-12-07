import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Button } from '@/shared/ui/Button/Button'
import { Input } from '@/shared/ui/Input/Input'
import { Card } from '@/shared/ui/Card/Card'
import styles from './Auth.module.css'
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi'

export const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login(credentials)
      navigate('/parser')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>FlexiParser</h1>
          <p className={styles.subtitle}>Sign in to your account</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Username"
            type="text"
            value={credentials.username}
            onChange={e => setCredentials({ ...credentials, username: e.target.value })}
            placeholder="Enter your username"
            required
            fullWidth
            leftIcon={<FiMail />}
          />

          <Input
            label="Password"
            type="password"
            value={credentials.password}
            onChange={e => setCredentials({ ...credentials, password: e.target.value })}
            placeholder="Enter your password"
            required
            fullWidth
            leftIcon={<FiLock />}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
            leftIcon={<FiLogIn />}
          >
            Sign In
          </Button>
        </form>

        <div className={styles.footer}>
          <p className={styles.text}>
            Don't have an account?{' '}
            <Link to="/register" className={styles.link}>
              Sign up
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}
