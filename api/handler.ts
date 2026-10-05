import type { IncomingMessage, ServerResponse } from 'http';
import { appReady } from '../server.ts';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    const app = await appReady;
    if (typeof app === 'function') {
      return app(req, res);
    }
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Invalid Express app instance' }));
  } catch (err: any) {
    console.error('Vercel API Handler critical error:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        error: 'خطای اجرای تابع سرور',
        message: err?.message || 'Serverless invocation error',
        stack: err?.stack,
        timestamp: new Date().toISOString(),
      })
    );
  }
}
