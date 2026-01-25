'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

interface RouteInfo {
  path: string;
  type: 'page' | 'api' | 'layout' | 'loading' | 'error' | 'not-found';
  file: string;
}

interface AutoDiscoveredRoutes {
  pages: RouteInfo[];
  api: RouteInfo[];
  layouts: RouteInfo[];
  special: RouteInfo[];
}

export function AutoSiteOverview() {
  const [routes, setRoutes] = useState<AutoDiscoveredRoutes | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/auto-routes')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setRoutes(data.routes)
        } else {
          setError(data.error || 'Failed to load routes')
        }
      })
      .catch(err => setError('Failed to fetch routes'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Auto-discovering routes...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">❌ {error}</p>
      </div>
    )
  }

  if (!routes) return null

  const formatPath = (path: string) => path === '/' ? '/' : path
  const getRouteDescription = (route: RouteInfo) => {
    switch (route.path) {
      case '/': return 'Home page'
      case '/blog': return 'Blog listing'
      case '/twitter-poster': return 'AI Twitter posting tool'
      case '/api/generate': return 'AI tweet generation'
      case '/api/twitter': return 'Twitter posting API'
      case '/api/twitter/csv': return 'Bulk CSV posting'
      case '/api/auto-routes': return 'Auto route discovery'
      default:
        if (route.path.includes('[slug]')) return 'Dynamic blog post'
        if (route.type === 'api') return 'API endpoint'
        return 'Application route'
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          🚀 Auto-Discovered Pages ({routes.pages.length})
        </h3>
        <div className="space-y-2">
          {routes.pages.map((route, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div>
                <Link 
                  href={formatPath(route.path)} 
                  className="font-medium text-blue-700 hover:text-blue-900 hover:underline"
                >
                  {route.path === '/' ? 'Home' : route.path.replace('/', '').replace('[slug]', '[slug]')}
                </Link>
                <span className="text-sm text-blue-600 ml-2">({formatPath(route.path)})</span>
                <span className="text-xs text-blue-500 ml-2">[{route.file}]</span>
              </div>
              <span className="text-sm text-blue-500">{getRouteDescription(route)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-green-900 mb-3">
          🔌 Auto-Discovered API Routes ({routes.api.length})
        </h3>
        <div className="space-y-2">
          {routes.api.map((route, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div>
                <span className="font-medium text-green-700">
                  {route.path.replace('/api/', '').replace('/', '') || 'API'}
                </span>
                <span className="text-sm text-green-600 ml-2">({route.path})</span>
                <span className="text-xs text-green-500 ml-2">[{route.file}]</span>
              </div>
              <span className="text-sm text-green-500">{getRouteDescription(route)}</span>
            </div>
          ))}
        </div>
      </div>

      {routes.special.length > 0 && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-purple-900 mb-3">
            ⚙️ Special Routes ({routes.special.length})
          </h3>
          <div className="space-y-2">
            {routes.special.map((route, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-purple-700 capitalize">{route.type}</span>
                  <span className="text-sm text-purple-600 ml-2">({route.path})</span>
                  <span className="text-xs text-purple-500 ml-2">[{route.file}]</span>
                </div>
                <span className="text-sm text-purple-500">{route.type} component</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-center text-xs text-gray-500">
        🤖 Routes automatically discovered from file system • 
        Total: {routes.pages.length + routes.api.length + routes.special.length} routes
      </div>
    </div>
  )
}