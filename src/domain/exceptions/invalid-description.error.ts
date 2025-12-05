import { DomainError } from './domain.error';

export class InvalidDescriptionError extends DomainError {
  constructor(message: string = 'Descrição é obrigatória') {
    super(message);
  }
}
