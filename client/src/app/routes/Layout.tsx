import React from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from '@features/layout/components/Header'
import { Sidebar } from '@features/layout/components/Sidebar'
import styles from './Layout.module.css'

export const Layout = () => {
  return (
    <div className={styles.layout}>
      <Header />
      <div className={styles.container}>
        <Sidebar />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
