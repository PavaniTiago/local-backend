import { Inject, Injectable } from '@nestjs/common';
import { Local } from '../../domain/entities/local.entity';
import { LOCAIS_REPOSITORY } from '../../shared/constants/injection-tokens';
import { ILocaisRepository } from '../../domain/repositories/locais.repository.interface';
import { CreateLocalDto } from '../dto/create-local.dto';
import { LocalResponseDto } from '../dto/local-response.dto';
import { Result, failure, success } from '../../shared/types/result';

@Injectable()
export class CreateLocalUseCase {
  constructor(
    @Inject(LOCAIS_REPOSITORY)
    private readonly locaisRepository: ILocaisRepository,
  ) {}

  async execute(dto: CreateLocalDto): Promise<Result<LocalResponseDto>> {
    const localResult = Local.create({
      nome: dto.nome,
      descricao: dto.descricao,
      latitude: dto.latitude,
      longitude: dto.longitude,
      imagem: dto.imagem,
    });

    if (localResult.isLeft) {
      return failure(localResult.value);
    }

    try {
      const savedLocal = await this.locaisRepository.save(localResult.value);
      return success(LocalResponseDto.fromDomain(savedLocal));
    } catch (error) {
      return failure(error as Error);
    }
  }
}
