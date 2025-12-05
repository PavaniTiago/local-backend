import { Result, failure, success } from '../../shared/types/result';
import { Coordinates } from '../value-objects/coordinates.vo';
import { ImageUrl } from '../value-objects/image-url.vo';
import { LocalId } from '../value-objects/local-id.vo';
import { InvalidNameError } from '../exceptions/invalid-name.error';
import { InvalidDescriptionError } from '../exceptions/invalid-description.error';

export class Local {
  private static readonly MIN_NAME_LENGTH = 3;
  private static readonly MAX_NAME_LENGTH = 100;
  private static readonly MAX_DESCRIPTION_LENGTH = 500;

  private constructor(
    private readonly _id: LocalId,
    private _nome: string,
    private _descricao: string,
    private _coordinates: Coordinates,
    private _imagem: ImageUrl,
  ) {}

  static create(props: {
    nome: string;
    descricao: string;
    latitude: number;
    longitude: number;
    imagem: string;
  }): Result<Local> {
    const nameResult = this.validateName(props.nome);
    if (nameResult.isLeft) {
      return failure(nameResult.value);
    }

    const descriptionResult = this.validateDescription(props.descricao);
    if (descriptionResult.isLeft) {
      return failure(descriptionResult.value);
    }

    const idResult = LocalId.create();
    if (idResult.isLeft) {
      return failure(idResult.value);
    }

    const coordinatesResult = Coordinates.create(
      props.latitude,
      props.longitude,
    );
    if (coordinatesResult.isLeft) {
      return failure(coordinatesResult.value);
    }

    const imageUrlResult = ImageUrl.create(props.imagem);
    if (imageUrlResult.isLeft) {
      return failure(imageUrlResult.value);
    }

    return success(
      new Local(
        idResult.value,
        props.nome,
        props.descricao,
        coordinatesResult.value,
        imageUrlResult.value,
      ),
    );
  }

  static reconstitute(props: {
    id: string;
    nome: string;
    descricao: string;
    latitude: number;
    longitude: number;
    imagem: string;
  }): Result<Local> {
    const idResult = LocalId.create(props.id);
    if (idResult.isLeft) {
      return failure(idResult.value);
    }

    const coordinatesResult = Coordinates.create(
      props.latitude,
      props.longitude,
    );
    if (coordinatesResult.isLeft) {
      return failure(coordinatesResult.value);
    }

    const imageUrlResult = ImageUrl.create(props.imagem);
    if (imageUrlResult.isLeft) {
      return failure(imageUrlResult.value);
    }

    return success(
      new Local(
        idResult.value,
        props.nome,
        props.descricao,
        coordinatesResult.value,
        imageUrlResult.value,
      ),
    );
  }

  get id(): LocalId {
    return this._id;
  }

  get nome(): string {
    return this._nome;
  }

  get descricao(): string {
    return this._descricao;
  }

  get coordinates(): Coordinates {
    return this._coordinates;
  }

  get imagem(): ImageUrl {
    return this._imagem;
  }

  get latitude(): number {
    return this._coordinates.latitude;
  }

  get longitude(): number {
    return this._coordinates.longitude;
  }

  changeName(nome: string): Result<void> {
    const nameResult = Local.validateName(nome);
    if (nameResult.isLeft) {
      return failure(nameResult.value);
    }

    this._nome = nome;
    return success(undefined);
  }

  changeDescription(descricao: string): Result<void> {
    const descriptionResult = Local.validateDescription(descricao);
    if (descriptionResult.isLeft) {
      return failure(descriptionResult.value);
    }

    this._descricao = descricao;
    return success(undefined);
  }

  relocate(coordinates: Coordinates): Result<void> {
    this._coordinates = coordinates;
    return success(undefined);
  }

  relocateToCoordinates(latitude: number, longitude: number): Result<void> {
    const coordinatesResult = Coordinates.create(latitude, longitude);

    if (coordinatesResult.isLeft) {
      return failure(coordinatesResult.value);
    }

    this._coordinates = coordinatesResult.value;
    return success(undefined);
  }

  changeImage(imageUrl: ImageUrl): Result<void> {
    this._imagem = imageUrl;
    return success(undefined);
  }

  changeImageUrl(url: string): Result<void> {
    const imageUrlResult = ImageUrl.create(url);

    if (imageUrlResult.isLeft) {
      return failure(imageUrlResult.value);
    }

    this._imagem = imageUrlResult.value;
    return success(undefined);
  }

  updateDetails(updates: {
    nome?: string;
    descricao?: string;
    latitude?: number;
    longitude?: number;
    imagem?: string;
  }): Result<void> {
    if (updates.nome !== undefined) {
      const result = this.changeName(updates.nome);
      if (result.isLeft) return result;
    }

    if (updates.descricao !== undefined) {
      const result = this.changeDescription(updates.descricao);
      if (result.isLeft) return result;
    }

    if (updates.latitude !== undefined && updates.longitude !== undefined) {
      const result = this.relocateToCoordinates(
        updates.latitude,
        updates.longitude,
      );
      if (result.isLeft) return result;
    }

    if (updates.imagem !== undefined) {
      const result = this.changeImageUrl(updates.imagem);
      if (result.isLeft) return result;
    }

    return success(undefined);
  }

  distanceTo(other: Local): number {
    return this._coordinates.distanceTo(other._coordinates);
  }

  private static validateName(nome: string): Result<void> {
    if (!nome || nome.trim().length === 0) {
      return failure(new InvalidNameError('Nome é obrigatório'));
    }

    if (nome.trim().length < Local.MIN_NAME_LENGTH) {
      return failure(
        new InvalidNameError(
          `Nome deve ter no mínimo ${Local.MIN_NAME_LENGTH} caracteres`,
        ),
      );
    }

    if (nome.length > Local.MAX_NAME_LENGTH) {
      return failure(
        new InvalidNameError(
          `Nome deve ter no máximo ${Local.MAX_NAME_LENGTH} caracteres`,
        ),
      );
    }

    return success(undefined);
  }

  private static validateDescription(descricao: string): Result<void> {
    if (!descricao || descricao.trim().length === 0) {
      return failure(new InvalidDescriptionError());
    }

    if (descricao.length > Local.MAX_DESCRIPTION_LENGTH) {
      return failure(
        new InvalidDescriptionError(
          `Descrição deve ter no máximo ${Local.MAX_DESCRIPTION_LENGTH} caracteres`,
        ),
      );
    }

    return success(undefined);
  }
}
