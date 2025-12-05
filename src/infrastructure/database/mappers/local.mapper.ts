import { Local } from '../../../domain/entities/local.entity';
import { LocalDbModel, NewLocalDbModel } from '../drizzle/schema/locais.schema';
import { Result } from '../../../shared/types/result';

export class LocalMapper {
  static toDomain(raw: LocalDbModel): Result<Local> {
    return Local.reconstitute({
      id: raw.id,
      nome: raw.nome,
      descricao: raw.descricao,
      latitude: raw.latitude,
      longitude: raw.longitude,
      imagem: raw.imagem,
    });
  }

  static toPersistence(local: Local): NewLocalDbModel {
    return {
      id: local.id.value,
      nome: local.nome,
      descricao: local.descricao,
      latitude: local.latitude,
      longitude: local.longitude,
      imagem: local.imagem.value,
    };
  }
}
