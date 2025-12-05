import {
  IsString,
  IsNumber,
  IsUrl,
  Min,
  Max,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';

export class UpdateLocalDto {
  @IsOptional()
  @IsString({ message: 'Nome deve ser uma string' })
  @MinLength(3, { message: 'Nome deve ter no mínimo 3 caracteres' })
  @MaxLength(100, { message: 'Nome deve ter no máximo 100 caracteres' })
  nome?: string;

  @IsOptional()
  @IsString({ message: 'Descrição deve ser uma string' })
  @MaxLength(500, { message: 'Descrição deve ter no máximo 500 caracteres' })
  descricao?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Latitude deve ser um número' })
  @Min(-90, { message: 'Latitude deve ser maior ou igual a -90' })
  @Max(90, { message: 'Latitude deve ser menor ou igual a 90' })
  latitude?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Longitude deve ser um número' })
  @Min(-180, { message: 'Longitude deve ser maior ou igual a -180' })
  @Max(180, { message: 'Longitude deve ser menor ou igual a 180' })
  longitude?: number;

  @IsOptional()
  @IsUrl({}, { message: 'Imagem deve ser uma URL válida' })
  imagem?: string;
}
