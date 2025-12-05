import { Either, left, right } from './either';

export type Result<T> = Either<Error, T>;

export const failure = <T>(error: Error): Result<T> => left(error);

export const success = <T>(value: T): Result<T> => right(value);

export const combine = <T>(results: Result<T>[]): Result<T[]> => {
  const values: T[] = [];

  for (const result of results) {
    if (result.isLeft) {
      return left(result.value);
    }
    values.push(result.value);
  }

  return right(values);
};
