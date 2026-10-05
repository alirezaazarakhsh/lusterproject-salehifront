import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool, type PoolConfig } from 'pg';
import * as schema from './schema.ts';

declare global {
  var _postgresPool: Pool | undefined;
}

export const isPostgresConfigured = (): boolean => {
  if (process.env.VERCEL) {
    return Boolean(
      process.env.DATABASE_URL ||
      process.env.POSTGRES_URL ||
      process.env.POSTGRES_PRISMA_URL ||
      (process.env.SQL_HOST && process.env.SQL_HOST !== 'localhost') ||
      (process.env.PGHOST && process.env.PGHOST !== 'localhost')
    );
  }
  return true;
};

export const createPool = (): Pool => {
  if (!global._postgresPool) {
    const connectionString =
      process.env.DATABASE_URL ||
      process.env.POSTGRES_URL ||
      process.env.POSTGRES_PRISMA_URL ||
      process.env.POSTGRES_URL_NON_POOLING;

    let poolConfig: PoolConfig;

    if (connectionString) {
      const needsSsl =
        connectionString.includes('sslmode=require') ||
        connectionString.includes('ssl=true') ||
        process.env.SQL_SSL === 'true' ||
        process.env.PGSSL === 'true';

      poolConfig = {
        connectionString,
        ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
        max: 10,
        connectionTimeoutMillis: 2000,
        idleTimeoutMillis: 30000,
      };
    } else {
      const host =
        process.env.SQL_HOST ||
        process.env.PGHOST ||
        process.env.POSTGRES_HOST ||
        'localhost';
      const port = Number(
        process.env.SQL_PORT ||
        process.env.PGPORT ||
        process.env.POSTGRES_PORT ||
        5432
      );
      const user =
        process.env.SQL_USER ||
        process.env.PGUSER ||
        process.env.POSTGRES_USER ||
        'postgres';
      const password =
        process.env.SQL_PASSWORD ||
        process.env.PGPASSWORD ||
        process.env.POSTGRES_PASSWORD ||
        '';
      const database =
        process.env.SQL_DB_NAME ||
        process.env.PGDATABASE ||
        process.env.POSTGRES_DATABASE ||
        'postgres';

      const needsSsl =
        process.env.SQL_SSL === 'true' ||
        process.env.PGSSL === 'true';

      poolConfig = {
        host,
        port,
        user,
        password,
        database,
        ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
        max: 10,
        connectionTimeoutMillis: 2000,
        idleTimeoutMillis: 30000,
      };
    }

    global._postgresPool = new Pool(poolConfig);

    global._postgresPool.on('error', (err) => {
      console.warn('PostgreSQL pool background notice:', err?.message || err);
    });
  }
  return global._postgresPool;
};

export const pool = createPool();

export const db = drizzle(pool, { schema });
