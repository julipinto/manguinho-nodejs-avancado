import { LoadUSerAccountRepository } from "@/data/contracts/repos";

import { newDb } from 'pg-mem';
import { Column, Entity, getRepository, PrimaryGeneratedColumn } from "typeorm";

class PgUserAccountRepository implements LoadUSerAccountRepository {
  async load(params: LoadUSerAccountRepository.Params): Promise<LoadUSerAccountRepository.Result> {
    const pgUserRepo = getRepository(PgUser)
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
    it('should return an account if email exists', async () => {
      const db = newDb();
      const connection = await db.adapters.createTypeormDataSource ({
          type: 'postgres',
          entities: [PgUser]
      })

      // create schema
      await connection.synchronize();
      const pgUserRepo = getRepository(PgUser)

      await pgUserRepo.save({ email: 'existing_email' });

      const sut = new PgUserAccountRepository();

      const account = await sut.load({ email: 'existing_email' });

      expect(account).toEqual({
        id: '1',
      })
    });
  });
});
