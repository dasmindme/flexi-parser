import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { FlexiParser } from '@/features/flexi-parser/FlexiParser'
import { Login } from '@features/auth/components/Login'
import { Register } from '@features/auth/components/Register'
import { Dashboard } from '@features/dashboard/Dashboard'
import { PresetManager } from '@features/presets/components/PresetManager'
import { ApiDiscovery } from '@features/api-discovery/components/ApiDiscovery'
import { Layout } from './Layout'
import { ProtectedRoute } from './ProtectedRoute'

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Публичные маршруты */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Защищенные маршруты с Layout */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/parser" replace />} />
        <Route path="parser" element={<FlexiParser />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="presets" element={<PresetManager />} />
        <Route path="discovery" element={<ApiDiscovery />} />
      </Route>
      
      {/* 404 */}
      <Route path="*" element={<Navigate to="/parser" replace />} />
    </Routes>
  )
}