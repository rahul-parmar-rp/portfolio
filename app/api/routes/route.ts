import { NextResponse } from 'next/server';

export async function GET() {
  const routes = {
    pages: [
      { path: '/', name: 'Home', description: 'Portfolio and blog overview' },
      { path: '/blog', name: 'Blog', description: 'Technical blog posts listing' },
      { path: '/blog/[slug]', name: 'Blog Post', description: 'Individual blog post pages' },
      { path: '/twitter-poster', name: 'Twitter Poster', description: 'AI-powered Twitter posting tool' },
    ],
    api: [
      { path: '/api/routes', name: 'Routes API', description: 'List all available routes' },
      { path: '/api/auto-routes', name: 'Auto Routes', description: 'Auto-discover routes from file system' },
      { path: '/api/generate', name: 'Generate Tweet', description: 'AI tweet generation using Ollama' },
      { path: '/api/twitter', name: 'Post Tweet', description: 'Post single tweet to Twitter' },
      { path: '/api/twitter/csv', name: 'Bulk Tweet', description: 'Post multiple tweets from CSV' },
    ],
    feeds: [
      { path: '/rss', name: 'RSS Feed', description: 'Blog RSS feed' },
      { path: '/sitemap.xml', name: 'Sitemap', description: 'XML sitemap for SEO' },
      { path: '/robots.txt', name: 'Robots', description: 'Robots.txt file' },
      { path: '/og', name: 'Open Graph', description: 'Dynamic OG image generation' },
    ]
  };

  return NextResponse.json({
    success: true,
    message: 'Available routes in this Next.js application',
    routes,
    totalRoutes: routes.pages.length + routes.api.length + routes.feeds.length
  });
}