import { type IMemoryDb, newDb } from "pg-mem";
import type { DataSource } from "typeorm";

export const makeFakeDb = async (entities?: any[]): Promise<{db: IMemoryDb, connection: DataSource}> => {
  let connection: DataSource;

  const db = newDb();

  db.public.registerFunction({
    name: 'current_database',
    implementation: () => 'test_db',
  });

  db.public.registerFunction({
    name: 'version',
    implementation: () => 'PostgreSQL 14.0 (pg-mem)',
  });

  connection = await db.adapters.createTypeormDataSource({
    type: 'postgres',
    entities: entities ?? ['src/infra/postgres/entities/index.ts'],
    synchronize: true,
  });

  await connection.initialize();

  return { db, connection };
}
