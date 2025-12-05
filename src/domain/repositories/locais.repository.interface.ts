import { Local } from '../entities/local.entity';

export interface ILocaisRepository {
  save(local: Local): Promise<Local>;
  findById(id: string): Promise<Local | null>;
  findAll(): Promise<Local[]>;
  update(id: string, local: Local): Promise<Local>;
  delete(id: string): Promise<void>;
}

export const LOCAIS_REPOSITORY = Symbol('LOCAIS_REPOSITORY');
