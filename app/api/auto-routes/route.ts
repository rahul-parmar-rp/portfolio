import { readdir, stat } from 'fs/promises';
import { join } from 'path';
import { NextResponse } from 'next/server';

interface RouteInfo {
  path: string;
  type: 'page' | 'api' | 'layout' | 'loading' | 'error' | 'not-found';
  file: string;
}

async function discoverRoutes(dir: string, basePath = '', routes: RouteInfo[] = []): Promise<RouteInfo[]> {
  try {
	const entries = await readdir(dir, { withFileTypes: true });
	
	for (const entry of entries) {
	  const fullPath = join(dir, entry.name);
	  
	  if (entry.isDirectory()) {
		// Handle dynamic routes [slug], [...slug], etc.
		const isDynamic = entry.name.startsWith('[') && entry.name.endsWith(']');
		const routeSegment = isDynamic ? `[${entry.name.slice(1, -1)}]` : entry.name;
		const newBasePath = basePath + '/' + routeSegment;
		
		await discoverRoutes(fullPath, newBasePath, routes);
	  } else if (entry.isFile()) {
		const fileName = entry.name;
		const routePath = basePath || '/';
		
		// Determine route type based on file name
		let type: RouteInfo['type'] = 'page';
		if (fileName === 'route.ts' || fileName === 'route.js') type = 'api';
		else if (fileName === 'layout.tsx' || fileName === 'layout.js') type = 'layout';
		else if (fileName === 'loading.tsx' || fileName === 'loading.js') type = 'loading';
		else if (fileName === 'error.tsx' || fileName === 'error.js') type = 'error';
		else if (fileName === 'not-found.tsx' || fileName === 'not-found.js') type = 'not-found';
		else if (fileName === 'page.tsx' || fileName === 'page.js') type = 'page';
		else continue; // Skip non-route files
		
		routes.push({
		  path: routePath,
		  type,
		  file: fileName
		});
	  }
	}
  } catch (error) {
	console.error('Error reading directory:', dir, error);
  }
  
  return routes;
}

export async function GET() {
  try {
	const appDir = join(process.cwd(), 'app');
	const routes = await discoverRoutes(appDir);
	
	// Group routes by type
	const groupedRoutes = {
	  pages: routes.filter(r => r.type === 'page'),
	  api: routes.filter(r => r.type === 'api'),
	  layouts: routes.filter(r => r.type === 'layout'),
	  special: routes.filter(r => ['loading', 'error', 'not-found'].includes(r.type))
	};
	
	return NextResponse.json({
	  success: true,
	  message: 'Auto-discovered routes from file system',
	  routes: groupedRoutes,
	  totalRoutes: routes.length,
	  discoveredAt: new Date().toISOString()
	});
  } catch (error) {
	return NextResponse.json(
	  { 
		error: 'Failed to discover routes',
		message: error instanceof Error ? error.message : 'Unknown error'
	  },
	  { status: 500 }
	);
  }
}