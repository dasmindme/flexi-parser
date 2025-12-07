import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@features/auth/hooks/useAuth'
import { Button } from '@/shared/ui/Button/Button'
import styles from './Layout.module.css'
import { FiLogOut, FiUser, FiBell } from 'react-icons/fi'

export const Header = () => {
  const location = useLocation()
  const { user, logout } = useAuth()

  const navItems = [
    { path: '/parser', label: 'Parser' },
    { path: '/presets', label: 'Presets' },
    { path: '/discovery', label: 'Discovery' },
    { path: '/dashboard', label: 'Dashboard' },
  ]

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.headerLeft}>
          <Link to="/" className={styles.logo}>
            <span className={styles.logoIcon}>⚡</span>
            <span className={styles.logoText}>FlexiParser</span>
          </Link>

          <nav className={styles.nav}>
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`${styles.navLink} ${
                  location.pathname === item.path ? styles.active : ''
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className={styles.headerRight}>
          <Button variant="outline" size="sm" leftIcon={<FiBell />}>
            Notifications
          </Button>

          <div className={styles.userMenu}>
            <span className={styles.userName}>
              <FiUser /> {user?.username}
            </span>

            <Button variant="outline" size="sm" onClick={logout} leftIcon={<FiLogOut />}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
