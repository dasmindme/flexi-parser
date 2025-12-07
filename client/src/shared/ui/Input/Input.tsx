import React, { forwardRef, useId } from 'react'
import clsx from 'clsx'
import styles from './Input.module.css'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, helperText, leftIcon, rightIcon, fullWidth = false, className, id, ...props },
    ref
  ) => {
    const generatedId = useId()
    const inputId = id || generatedId

    return (
      <div className={clsx(styles.container, { [styles.fullWidth]: fullWidth })}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
          </label>
        )}

        <div className={styles.inputWrapper}>
          {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}

          <input
            id={inputId}
            ref={ref}
            className={clsx(
              styles.input,
              {
                [styles.hasLeftIcon]: !!leftIcon,
                [styles.hasRightIcon]: !!rightIcon,
                [styles.error]: !!error,
              },
              className
            )}
            {...props}
          />

          {rightIcon && <span className={styles.rightIcon}>{rightIcon}</span>}
        </div>

        {(error || helperText) && (
          <p className={clsx(styles.helperText, { [styles.error]: !!error })}>
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
