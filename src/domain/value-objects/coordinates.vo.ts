import { Result, failure, success } from '../../shared/types/result';
import { InvalidCoordinatesError } from '../exceptions/invalid-coordinates.error';

export class Coordinates {
  private static readonly MIN_LATITUDE = -90;
  private static readonly MAX_LATITUDE = 90;
  private static readonly MIN_LONGITUDE = -180;
  private static readonly MAX_LONGITUDE = 180;

  private constructor(
    private readonly _latitude: number,
    private readonly _longitude: number,
  ) {}

  static create(latitude: number, longitude: number): Result<Coordinates> {
    if (
      latitude < Coordinates.MIN_LATITUDE ||
      latitude > Coordinates.MAX_LATITUDE
    ) {
      return failure(InvalidCoordinatesError.invalidLatitude());
    }

    if (
      longitude < Coordinates.MIN_LONGITUDE ||
      longitude > Coordinates.MAX_LONGITUDE
    ) {
      return failure(InvalidCoordinatesError.invalidLongitude());
    }

    return success(new Coordinates(latitude, longitude));
  }

  get latitude(): number {
    return this._latitude;
  }

  get longitude(): number {
    return this._longitude;
  }

  equals(other: Coordinates): boolean {
    if (!other) {
      return false;
    }
    return (
      this._latitude === other._latitude && this._longitude === other._longitude
    );
  }

  distanceTo(other: Coordinates): number {
    const R = 6371;
    const dLat = this.toRad(other._latitude - this._latitude);
    const dLon = this.toRad(other._longitude - this._longitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(this._latitude)) *
        Math.cos(this.toRad(other._latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }
}
