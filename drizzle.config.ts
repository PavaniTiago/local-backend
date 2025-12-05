import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL!;
const isLocalhost =
  databaseUrl.includes('localhost') || databaseUrl.includes('127.0.0.1');

export default {
  schema: './src/infrastructure/database/drizzle/schema/*.schema.ts',
  out: './src/infrastructure/database/drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: databaseUrl,
    ssl: isLocalhost ? false : 'require',
  },
} satisfies Config;
