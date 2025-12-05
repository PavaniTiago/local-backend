export type Either<L, R> = Left<L, R> | Right<L, R>;

export class Left<L, R> {
  readonly value: L;
  readonly isLeft = true;
  readonly isRight = false;

  constructor(value: L) {
    this.value = value;
  }

  static create<L, R>(value: L): Either<L, R> {
    return new Left<L, R>(value);
  }
}

export class Right<L, R> {
  readonly value: R;
  readonly isLeft = false;
  readonly isRight = true;

  constructor(value: R) {
    this.value = value;
  }

  static create<L, R>(value: R): Either<L, R> {
    return new Right<L, R>(value);
  }
}

export const left = <L, R>(l: L): Either<L, R> => new Left<L, R>(l);

export const right = <L, R>(r: R): Either<L, R> => new Right<L, R>(r);
