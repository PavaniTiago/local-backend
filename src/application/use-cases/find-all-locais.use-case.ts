import { Inject, Injectable } from '@nestjs/common';
import { LOCAIS_REPOSITORY } from '../../shared/constants/injection-tokens';
import { ILocaisRepository } from '../../domain/repositories/locais.repository.interface';
import { LocalResponseDto } from '../dto/local-response.dto';
import { Result, success, failure } from '../../shared/types/result';

@Injectable()
export class FindAllLocaisUseCase {
  constructor(
    @Inject(LOCAIS_REPOSITORY)
    private readonly locaisRepository: ILocaisRepository,
  ) {}

  async execute(): Promise<Result<LocalResponseDto[]>> {
    try {
      const locais = await this.locaisRepository.findAll();
      return success(LocalResponseDto.fromDomainArray(locais));
    } catch (error) {
      return failure(error as Error);
    }
  }
}
