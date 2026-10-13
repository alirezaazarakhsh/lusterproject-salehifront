import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

declare global {
  var _postgresPool: Pool | undefined;
}

export const createPool = () => {
  if (!global._postgresPool) {
    const isVercel = Boolean(process.env.VERCEL);
    global._postgresPool = new Pool({
      host: (process.env.SQL_HOST?.startsWith('/')) 
        ? process.env.SQL_HOST 
        : (process.env.DB_HOST || process.env.SQL_HOST || 'localhost'),
      port: process.env.SQL_PORT ? Number(process.env.SQL_PORT) : 5432,
      user: process.env.SQL_USER || 'salehi_user',
      password: process.env.SQL_PASSWORD || 'salehi_secure_password_2026',
      database: process.env.SQL_DB_NAME || 'salehi_chandelier_db',
      max: 25,
      connectionTimeoutMillis: isVercel ? 5000 : 30000,
      idleTimeoutMillis: 60000,
      keepAlive: true,
      keepAliveInitialDelayMillis: 10000,
    });

    global._postgresPool.on('error', (err: any) => {
      // Gracefully capture pool idle error without crashing the server process
      if (
        !err?.message?.includes('Connection terminated') &&
        !err?.message?.includes('closed')
      ) {
        console.warn('Postgres pool background client notification:', err?.message);
      }
    });
  }
  return global._postgresPool;
};

export const pool = createPool();

export const db = drizzle(pool, { schema });

/**
 * کمکی برای اجرای امن کوئری‌های دیتابیس با امکان تلاش مجدد خودکار در صورت بروز خطای زودگذر اتصال
 */
export async function executeWithRetry<T>(
  fn: () => Promise<T>,
  retries = 2,
  delayMs = 250
): Promise<T> {
  let lastError: any;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;
      const errMsg = String(err?.message || '');
      const causeMsg = String(err?.cause?.message || '');
      const isTransient =
        errMsg.includes('Connection terminated') ||
        errMsg.includes('connection timeout') ||
        errMsg.includes('timeout') ||
        errMsg.includes('ECONNRESET') ||
        errMsg.includes('ECONNREFUSED') ||
        errMsg.includes('57P01') ||
        causeMsg.includes('Connection terminated') ||
        causeMsg.includes('timeout') ||
        causeMsg.includes('ECONNRESET');

      if (isTransient && attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * (attempt + 1)));
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}
