import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateLocalUseCase } from '../../../application/use-cases/create-local.use-case';
import { FindAllLocaisUseCase } from '../../../application/use-cases/find-all-locais.use-case';
import { FindLocalByIdUseCase } from '../../../application/use-cases/find-local-by-id.use-case';
import { UpdateLocalUseCase } from '../../../application/use-cases/update-local.use-case';
import { DeleteLocalUseCase } from '../../../application/use-cases/delete-local.use-case';
import { CreateLocalDto } from '../../../application/dto/create-local.dto';
import { UpdateLocalDto } from '../../../application/dto/update-local.dto';
import { LocalNotFoundException } from '../../../shared/exceptions/local-not-found.exception';
import { DomainError } from '../../../domain/exceptions/domain.error';

@Controller('locais')
export class LocaisController {
  constructor(
    private readonly createLocalUseCase: CreateLocalUseCase,
    private readonly findAllLocaisUseCase: FindAllLocaisUseCase,
    private readonly findLocalByIdUseCase: FindLocalByIdUseCase,
    private readonly updateLocalUseCase: UpdateLocalUseCase,
    private readonly deleteLocalUseCase: DeleteLocalUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateLocalDto) {
    const result = await this.createLocalUseCase.execute(dto);

    if (result.isLeft) {
      this.handleError(result.value);
    }

    return result.value;
  }

  @Get()
  async findAll() {
    const result = await this.findAllLocaisUseCase.execute();

    if (result.isLeft) {
      this.handleError(result.value);
    }

    return result.value;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.findLocalByIdUseCase.execute(id);

    if (result.isLeft) {
      this.handleError(result.value);
    }

    return result.value;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateLocalDto) {
    const result = await this.updateLocalUseCase.execute(id, dto);

    if (result.isLeft) {
      this.handleError(result.value);
    }

    return result.value;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    const result = await this.deleteLocalUseCase.execute(id);

    if (result.isLeft) {
      this.handleError(result.value);
    }
  }

  private handleError(error: Error): never {
    if (error instanceof LocalNotFoundException) {
      throw new NotFoundException(error.message);
    }

    if (error instanceof DomainError) {
      throw new BadRequestException(error.message);
    }

    throw new InternalServerErrorException(
      'Ocorreu um erro inesperado ao processar sua solicitação',
    );
  }
}
