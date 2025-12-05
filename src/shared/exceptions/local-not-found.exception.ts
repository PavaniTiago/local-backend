import { NotFoundException } from '@nestjs/common';

export class LocalNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Local com ID "${id}" não foi encontrado`);
  }
}
