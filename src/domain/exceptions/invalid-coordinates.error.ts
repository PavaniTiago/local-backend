import { DomainError } from './domain.error';

export class InvalidCoordinatesError extends DomainError {
  constructor(message: string) {
    super(message);
  }

  static invalidLatitude(): InvalidCoordinatesError {
    return new InvalidCoordinatesError('Latitude deve estar entre -90 e 90');
  }

  static invalidLongitude(): InvalidCoordinatesError {
    return new InvalidCoordinatesError('Longitude deve estar entre -180 e 180');
  }
}
