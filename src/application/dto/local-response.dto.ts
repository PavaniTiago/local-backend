import { Local } from '../../domain/entities/local.entity';

export class LocalResponseDto {
  id: string;
  nome: string;
  descricao: string;
  latitude: number;
  longitude: number;
  imagem: string;

  static fromDomain(local: Local): LocalResponseDto {
    return {
      id: local.id.value,
      nome: local.nome,
      descricao: local.descricao,
      latitude: local.latitude,
      longitude: local.longitude,
      imagem: local.imagem.value,
    };
  }

  static fromDomainArray(locais: Local[]): LocalResponseDto[] {
    return locais.map((local) => this.fromDomain(local));
  }
}
