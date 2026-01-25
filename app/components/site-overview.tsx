import Link from 'next/link'

export function SiteOverview() {
  const routes = [
    { path: '/', name: 'Home', description: 'Portfolio and blog overview' },
    { path: '/blog', name: 'Blog', description: 'Technical blog posts' },
    { path: '/twitter-poster', name: 'Twitter Poster', description: 'AI-powered Twitter posting tool' },
  ]

  const apiRoutes = [
    { path: '/api/generate', name: 'Generate Tweet', description: 'AI tweet generation API' },
    { path: '/api/twitter', name: 'Post Tweet', description: 'Twitter posting API' },
    { path: '/api/twitter/csv', name: 'Bulk Tweet', description: 'CSV bulk posting API' },
    { path: '/rss', name: 'RSS Feed', description: 'Blog RSS feed' },
    { path: '/sitemap.xml', name: 'Sitemap', description: 'Site structure' },
  ]

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">📄 Available Pages</h3>
        <div className="space-y-2">
          {routes.map((route) => (
            <div key={route.path} className="flex items-center justify-between">
              <div>
                <Link 
                  href={route.path} 
                  className="font-medium text-blue-700 hover:text-blue-900 hover:underline"
                >
                  {route.name}
                </Link>
                <span className="text-sm text-blue-600 ml-2">({route.path})</span>
              </div>
              <span className="text-sm text-blue-500">{route.description}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-green-900 mb-3">🔌 API Endpoints</h3>
        <div className="space-y-2">
          {apiRoutes.map((route) => (
            <div key={route.path} className="flex items-center justify-between">
              <div>
                <span className="font-medium text-green-700">{route.name}</span>
                <span className="text-sm text-green-600 ml-2">({route.path})</span>
              </div>
              <span className="text-sm text-green-500">{route.description}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}