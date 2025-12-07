import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import clsx from 'clsx'
import styles from './Modal.module.css'
import { Button } from '../Button/Button'
import { FiX } from 'react-icons/fi'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showCloseButton?: boolean
  className?: string
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  className,
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  return ReactDOM.createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={clsx(styles.modal, styles[size], className)}
        onClick={e => e.stopPropagation()}
      >
        {(title || showCloseButton) && (
          <div className={styles.header}>
            {title && <h2 className={styles.title}>{title}</h2>}
            {showCloseButton && (
              <Button variant="outline" size="sm" onClick={onClose} className={styles.closeButton}>
                <FiX />
              </Button>
            )}
          </div>
        )}

        <div className={styles.content}>{children}</div>
      </div>
    </div>,
    document.body
  )
}
