import { Module } from '@nestjs/common';
import { LocaisController } from '../controllers/locais.controller';
import { CreateLocalUseCase } from '../../../application/use-cases/create-local.use-case';
import { FindAllLocaisUseCase } from '../../../application/use-cases/find-all-locais.use-case';
import { FindLocalByIdUseCase } from '../../../application/use-cases/find-local-by-id.use-case';
import { UpdateLocalUseCase } from '../../../application/use-cases/update-local.use-case';
import { DeleteLocalUseCase } from '../../../application/use-cases/delete-local.use-case';
import { DrizzleLocaisRepository } from '../../database/repositories/drizzle-locais.repository';
import { LOCAIS_REPOSITORY } from '../../../shared/constants/injection-tokens';

@Module({
  controllers: [LocaisController],
  providers: [
    CreateLocalUseCase,
    FindAllLocaisUseCase,
    FindLocalByIdUseCase,
    UpdateLocalUseCase,
    DeleteLocalUseCase,
    {
      provide: LOCAIS_REPOSITORY,
      useClass: DrizzleLocaisRepository,
    },
  ],
})
export class LocaisModule {}
