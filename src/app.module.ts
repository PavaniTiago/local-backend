import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DrizzleModule } from './infrastructure/database/drizzle/drizzle.module';
import { LocaisModule } from './infrastructure/http/modules/locais.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DrizzleModule,
    LocaisModule,
  ],
})
export class AppModule {}
