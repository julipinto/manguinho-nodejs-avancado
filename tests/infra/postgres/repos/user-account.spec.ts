import { PgUser } from "@/infra/postgres/entities";
import { PgUserAccountRepository } from "@/infra/postgres/repos";

import { makeFakeDb } from "@/tests/infra/postgres/mocks";
import { IBackup } from 'pg-mem';
import { DataSource, Repository } from "typeorm";


describe('PgUserAccountRepository', () => {
  describe('load', () => {
    let sut: PgUserAccountRepository;
    let connection: DataSource;
    let pgUserRepo: Repository<PgUser>;
    let backup: IBackup

    beforeAll(async () => {
      const {db, connection: fakeConnection } = await makeFakeDb([PgUser]);
      connection = fakeConnection;

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


