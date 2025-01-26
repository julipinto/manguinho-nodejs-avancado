import { PgUser } from "@/infra/postgres/entities";
import { PgUserAccountRepository } from "@/infra/postgres/repos";

import { makeFakeDb } from "@/tests/infra/postgres/mocks";
import { IBackup } from 'pg-mem';
import { DataSource, Repository } from "typeorm";
import { makeFakeDb } from "@/tests/infra/postgres/mocks";


describe('PgUserAccountRepository', () => {
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

  describe('load', () => {
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

  describe('saveWithFacebook', () => {
    it('should create an account if id is undefined', async () => {
      await sut.saveWithFacebook({
        email: 'any_email',
        name: 'any_name',
        facebookId: 'any_fb_id',
      })

      const user = await pgUserRepo.findOneBy({ email: 'any_email' });

      expect(user?.id).toBe(1);
    });

    it('should update account if id is defined', async () => {
      await pgUserRepo.save({
        email: 'any_email',
        name: 'any_name',
        facebookId: 'any_fb_id',
      });

      await sut.saveWithFacebook({
        id: '1',
        email: 'new_email',
        name: 'new_name',
        facebookId: 'new_fb_id',
      });

      const user = await pgUserRepo.findOneBy({ id: 1 });

      expect(user).toEqual({
        id: 1,
        email: 'any_email',
        name: 'new_name',
        facebookId: 'new_fb_id',
      })
    });
  });
});


