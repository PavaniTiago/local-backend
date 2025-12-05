import { Result, failure, success } from '../../shared/types/result';
import { InvalidImageUrlError } from '../exceptions/invalid-image-url.error';

export class ImageUrl {
  private constructor(private readonly _value: string) {}

  static create(url: string): Result<ImageUrl> {
    if (!url || url.trim().length === 0) {
      return failure(new InvalidImageUrlError('URL da imagem é obrigatória'));
    }

    try {
      new URL(url);
    } catch {
      return failure(new InvalidImageUrlError());
    }

    return success(new ImageUrl(url));
  }

  get value(): string {
    return this._value;
  }

  equals(other: ImageUrl): boolean {
    if (!other) {
      return false;
    }
    return this._value === other._value;
  }
}
