import type { IncomingMessage, ServerResponse } from 'http';
import { appReady } from '../server.ts';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    const app = await appReady;
    return (app as any)(req, res);
  } catch (err: any) {
    console.error('Vercel API Handler error:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        error: 'خطای اجرای تابع سرور',
        message: err?.message || 'Serverless invocation error',
        timestamp: new Date().toISOString(),
      })
    );
  }
}
