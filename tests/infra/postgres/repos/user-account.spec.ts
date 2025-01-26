import { LoadUSerAccountRepository } from "@/data/contracts/repos";

import { IBackup, newDb } from 'pg-mem';
import { Column, DataSource, Entity, PrimaryGeneratedColumn, Repository } from "typeorm";

class PgUserAccountRepository implements LoadUSerAccountRepository {
  constructor(private readonly connection: DataSource) {}

  async load(params: LoadUSerAccountRepository.Params): Promise<LoadUSerAccountRepository.Result> {
    const pgUserRepo = this.connection.getRepository(PgUser);
    const pgUser = await pgUserRepo.findOneBy({ email: params.email });
    if (!!pgUser) {
      return {
        id: pgUser?.id?.toString(),
        name: pgUser.name ?? undefined,
      }
    }
  }
}

@Entity({  name: 'usuarios' })
class PgUser {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ nullable: true, name: 'nome' })
  name?: string

  @Column()
  email!: string

  @Column({ nullable: true, name: 'id_facebook' })
  facebookId!: string
}

describe('PgUserAccountRepository', () => {
  describe('load', () => {
    let sut: PgUserAccountRepository;
    let connection: DataSource;
    let pgUserRepo: Repository<PgUser>;
    let backup: IBackup

    beforeAll(async () => {
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
        entities: [PgUser],
        synchronize: true,
      });

      await connection.initialize();

      backup = db.backup()

      pgUserRepo = connection.getRepository(PgUser);
    });

    beforeEach(() => {
      backup.restore();
      sut = new PgUserAccountRepository(connection);
    });

    afterAll(async () => {
      await connection.destroy();
    });

    it('should return an account if email exists', async () => {
      await pgUserRepo.save({ email: 'existing_email' });

      const account = await sut.load({ email: 'existing_email' });

      expect(account).toEqual({
        id: '1',
      });

    });

    it('should return undefined if email does not exists', async () => {
      const account = await sut.load({ email: 'new_email' });

      expect(account).toBeUndefined();
    });
  });
});


