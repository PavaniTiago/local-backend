import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import { DRIZZLE_DB } from '../../../shared/constants/injection-tokens';
import * as schema from './schema';

const postgres = require('postgres');

@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE_DB,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const connectionString = configService.get<string>('DATABASE_URL');
        if (!connectionString) {
          throw new Error('DATABASE_URL não está definida');
        }

        const isLocalhost =
          connectionString.includes('localhost') ||
          connectionString.includes('127.0.0.1');

        const client = postgres(connectionString, {
          ssl: isLocalhost ? false : { rejectUnauthorized: false },
          max: 10,
          idle_timeout: 20,
          connect_timeout: 10,
        });

        return drizzle(client, { schema });
      },
    },
  ],
  exports: [DRIZZLE_DB],
})
export class DrizzleModule {}
