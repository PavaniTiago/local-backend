import { Inject, Injectable } from '@nestjs/common';
import { LOCAIS_REPOSITORY } from '../../shared/constants/injection-tokens';
import { ILocaisRepository } from '../../domain/repositories/locais.repository.interface';
import { LocalResponseDto } from '../dto/local-response.dto';
import { LocalNotFoundException } from '../../shared/exceptions/local-not-found.exception';
import { Result, success, failure } from '../../shared/types/result';

@Injectable()
export class FindLocalByIdUseCase {
  constructor(
    @Inject(LOCAIS_REPOSITORY)
    private readonly locaisRepository: ILocaisRepository,
  ) {}

  async execute(id: string): Promise<Result<LocalResponseDto>> {
    try {
      const local = await this.locaisRepository.findById(id);

      if (!local) {
        return failure(new LocalNotFoundException(id));
      }

      return success(LocalResponseDto.fromDomain(local));
    } catch (error) {
      return failure(error as Error);
    }
  }
}
