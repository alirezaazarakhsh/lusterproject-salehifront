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
      max: 10,
      connectionTimeoutMillis: isVercel ? 1500 : 5000,
      idleTimeoutMillis: 10000,
      keepAlive: true,
    });

    global._postgresPool.on('error', (_err) => {
      // Gracefully capture pool idle error without crashing
    });
  }
  return global._postgresPool;
};

export const pool = createPool();

export const db = drizzle(pool, { schema });
