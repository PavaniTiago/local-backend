import { Result, success } from '../../shared/types/result';

export class LocalId {
  private constructor(private readonly _value: string) {}

  static create(id?: string): Result<LocalId> {
    const uuid = id || crypto.randomUUID();
    return success(new LocalId(uuid));
  }

  get value(): string {
    return this._value;
  }

  equals(other: LocalId): boolean {
    if (!other) {
      return false;
    }
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
