import { DomainError } from './domain.error';

export class InvalidImageUrlError extends DomainError {
  constructor(message: string = 'URL da imagem inválida') {
    super(message);
  }
}
