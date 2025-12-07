import { Link, useLocation } from 'react-router-dom'
import styles from './Layout.module.css'
import {
  FiCode,
  FiDatabase,
  FiGlobe,
  FiHome,
  FiSettings,
  FiHelpCircle,
  FiFileText,
} from 'react-icons/fi'

export const Sidebar = () => {
  const location = useLocation()

  const menuItems = [
    { path: '/parser', label: 'API Parser', icon: <FiCode /> },
    { path: '/presets', label: 'Presets', icon: <FiDatabase /> },
    { path: '/discovery', label: 'API Discovery', icon: <FiGlobe /> },
    { path: '/dashboard', label: 'Dashboard', icon: <FiHome /> },
  ]

  const secondaryItems = [
    { path: '/settings', label: 'Settings', icon: <FiSettings /> },
    { path: '/help', label: 'Help', icon: <FiHelpCircle /> },
    { path: '/docs', label: 'Documentation', icon: <FiFileText /> },
  ]

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarContent}>
        <nav className={styles.sidebarNav}>
          <div className={styles.sidebarSection}>
            <h3 className={styles.sectionTitle}>Main</h3>
            {menuItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`${styles.sidebarLink} ${
                  location.pathname === item.path ? styles.active : ''
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          <div className={styles.sidebarSection}>
            <h3 className={styles.sectionTitle}>Additional</h3>
            {secondaryItems.map(item => (
              <Link key={item.path} to={item.path} className={styles.sidebarLink}>
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.version}>v1.0.0</div>
        </div>
      </div>
    </aside>
  )
}
