import React from 'react'
import { Card } from '@/shared/ui/Card/Card'
import { useAuth } from '@features/auth/context/AuthContext'
import styles from './Dashboard.module.css'
import { FiActivity, FiDatabase, FiGlobe, FiUsers, FiBarChart } from 'react-icons/fi'

export const Dashboard = () => {
  const { user } = useAuth()

  const stats = [
    { label: 'API Requests', value: '1,234', icon: <FiActivity />, color: '#2eb67d' },
    { label: 'Presets', value: '45', icon: <FiDatabase />, color: '#6366f1' },
    { label: 'Endpoints Discovered', value: '12', icon: <FiGlobe />, color: '#f59e0b' },
    { label: 'Exports', value: '78', icon: <FiBarChart />, color: '#ef4444' }
  ]

  const recentActivity = [
    { action: 'Created new preset', time: '2 hours ago', user: user?.username },
    { action: 'Exported GeoJSON', time: 'Yesterday', user: user?.username },
    { action: 'Discovered new API', time: '2 days ago', user: user?.username },
    { action: 'Updated parser settings', time: '3 days ago', user: user?.username }
  ]

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>Welcome back, {user?.username}!</p>
      </div>

      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <Card key={index} className={styles.statCard}>
            <div className={styles.statHeader}>
              <div 
                className={styles.statIcon}
                style={{ backgroundColor: `${stat.color}20`, color: stat.color }}
              >
                {stat.icon}
              </div>
              <div className={styles.statInfo}>
                <h3 className={styles.statValue}>{stat.value}</h3>
                <p className={styles.statLabel}>{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className={styles.contentGrid}>
        <Card className={styles.card}>
          <h3 className={styles.cardTitle}>Recent Activity</h3>
          <div className={styles.activityList}>
            {recentActivity.map((activity, index) => (
              <div key={index} className={styles.activityItem}>
                <div className={styles.activityContent}>
                  <span className={styles.activityAction}>{activity.action}</span>
                  <span className={styles.activityUser}>by {activity.user}</span>
                </div>
                <span className={styles.activityTime}>{activity.time}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className={styles.card}>
          <h3 className={styles.cardTitle}>Quick Actions</h3>
          <div className={styles.actionsGrid}>
            <button className={styles.actionButton}>
              <FiDatabase />
              <span>Manage Presets</span>
            </button>
            <button className={styles.actionButton}>
              <FiGlobe />
              <span>Discover APIs</span>
            </button>
            <button className={styles.actionButton}>
              <FiActivity />
              <span>Run Parser</span>
            </button>
            <button className={styles.actionButton}>
              <FiBarChart />
              <span>View Reports</span>
            </button>
          </div>
        </Card>
      </div>
    </div>
  )
}