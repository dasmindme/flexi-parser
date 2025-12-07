import React from 'react'
import clsx from 'clsx'
import styles from './Button.module.css'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  fullWidth?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  ...props
}) => {
  const buttonClass = clsx(
    styles.button,
    styles[variant],
    styles[size],
    {
      [styles.loading]: isLoading,
      [styles.fullWidth]: fullWidth,
    },
    className
  )

  return (
    <button className={buttonClass} disabled={disabled || isLoading} {...props}>
      {isLoading && <span className={styles.spinner} />}
      {leftIcon && !isLoading && <span className={styles.leftIcon}>{leftIcon}</span>}
      {children}
      {rightIcon && !isLoading && <span className={styles.rightIcon}>{rightIcon}</span>}
    </button>
  )
}
