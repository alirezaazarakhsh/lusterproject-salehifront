import type { IncomingMessage, ServerResponse } from 'http';
import { appReady } from '../server.ts';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    // Restore original request path if rewritten by Vercel
    if (req.url) {
      const urlObj = new URL(req.url, 'http://localhost');
      const targetPath = urlObj.searchParams.get('path');
      if (targetPath) {
        req.url = targetPath;
      } else {
        const matchedPath = req.headers['x-matched-path'] as string;
        if (matchedPath && matchedPath !== '/api/index') {
          req.url = matchedPath;
        }
      }
    }

    const app = await appReady;
    return (app as any)(req, res);
  } catch (error: any) {
    console.error('Vercel serverless function invocation error:', error);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        error: error?.message || 'Serverless function execution error',
        fallback: true
      }));
    }
  }
}
