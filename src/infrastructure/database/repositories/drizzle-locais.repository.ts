import { Injectable, Inject } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import { ILocaisRepository } from '../../../domain/repositories/locais.repository.interface';
import { Local } from '../../../domain/entities/local.entity';
import { locaisTable } from '../drizzle/schema/locais.schema';
import { LocalMapper } from '../mappers/local.mapper';
import { DRIZZLE_DB } from '../../../shared/constants/injection-tokens';

@Injectable()
export class DrizzleLocaisRepository implements ILocaisRepository {
  constructor(
    @Inject(DRIZZLE_DB)
    private readonly db: PostgresJsDatabase,
  ) {}

  async save(local: Local): Promise<Local> {
    const data = LocalMapper.toPersistence(local);
    const [saved] = await this.db.insert(locaisTable).values(data).returning();

    const domainResult = LocalMapper.toDomain(saved);
    if (domainResult.isLeft) {
      throw domainResult.value;
    }

    return domainResult.value;
  }

  async findById(id: string): Promise<Local | null> {
    const [result] = await this.db
      .select()
      .from(locaisTable)
      .where(eq(locaisTable.id, id));

    if (!result) {
      return null;
    }

    const domainResult = LocalMapper.toDomain(result);
    if (domainResult.isLeft) {
      throw domainResult.value;
    }

    return domainResult.value;
  }

  async findAll(): Promise<Local[]> {
    const results = await this.db.select().from(locaisTable);

    const locais: Local[] = [];
    for (const result of results) {
      const domainResult = LocalMapper.toDomain(result);
      if (domainResult.isRight) {
        locais.push(domainResult.value);
      }
    }

    return locais;
  }

  async update(id: string, local: Local): Promise<Local> {
    const data = LocalMapper.toPersistence(local);
    const [updated] = await this.db
      .update(locaisTable)
      .set(data)
      .where(eq(locaisTable.id, id))
      .returning();

    const domainResult = LocalMapper.toDomain(updated);
    if (domainResult.isLeft) {
      throw domainResult.value;
    }

    return domainResult.value;
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(locaisTable).where(eq(locaisTable.id, id));
  }
}
