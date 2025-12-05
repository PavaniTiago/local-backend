import { Inject, Injectable } from '@nestjs/common';
import { LOCAIS_REPOSITORY } from '../../shared/constants/injection-tokens';
import { ILocaisRepository } from '../../domain/repositories/locais.repository.interface';
import { UpdateLocalDto } from '../dto/update-local.dto';
import { LocalResponseDto } from '../dto/local-response.dto';
import { LocalNotFoundException } from '../../shared/exceptions/local-not-found.exception';
import { Result, failure, success } from '../../shared/types/result';

@Injectable()
export class UpdateLocalUseCase {
  constructor(
    @Inject(LOCAIS_REPOSITORY)
    private readonly locaisRepository: ILocaisRepository,
  ) {}

  async execute(
    id: string,
    dto: UpdateLocalDto,
  ): Promise<Result<LocalResponseDto>> {
    try {
      const local = await this.locaisRepository.findById(id);

      if (!local) {
        return failure(new LocalNotFoundException(id));
      }

      const updateResult = local.updateDetails(dto);
      if (updateResult.isLeft) {
        return failure(updateResult.value);
      }

      const updatedLocal = await this.locaisRepository.update(id, local);

      return success(LocalResponseDto.fromDomain(updatedLocal));
    } catch (error) {
      return failure(error as Error);
    }
  }
}
