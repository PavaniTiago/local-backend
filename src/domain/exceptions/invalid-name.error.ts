import { DomainError } from './domain.error';

export class InvalidNameError extends DomainError {
  constructor(
    message: string = 'Nome é obrigatório e deve ter no mínimo 3 caracteres',
  ) {
    super(message);
  }
}
