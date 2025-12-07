import React from 'react'
import styles from './LoadingSpinner.module.css'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: string
  className?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color,
  className,
}) => {
  const sizeClass = styles[size]
  const spinnerStyle = color ? { borderTopColor: color } : undefined

  return (
    <div className={`${styles.spinner} ${sizeClass} ${className || ''}`}>
      <div className={styles.spinnerInner} style={spinnerStyle} />
    </div>
  )
}
