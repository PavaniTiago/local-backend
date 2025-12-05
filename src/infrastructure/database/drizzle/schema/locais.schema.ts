import { pgTable, uuid, text, doublePrecision } from 'drizzle-orm/pg-core';

export const locaisTable = pgTable('locais', {
  id: uuid('id').primaryKey().defaultRandom(),
  nome: text('nome').notNull(),
  descricao: text('descricao').notNull(),
  latitude: doublePrecision('latitude').notNull(),
  longitude: doublePrecision('longitude').notNull(),
  imagem: text('imagem').notNull(),
});

export type LocalDbModel = typeof locaisTable.$inferSelect;
export type NewLocalDbModel = typeof locaisTable.$inferInsert;
