import { LoadUSerAccountRepository, SaveUserAccountByFacebookRepository } from "@/data/contracts/repos";
import { PgUser } from "@/infra/postgres/entities";

import { DataSource } from "typeorm";

export class PgUserAccountRepository implements LoadUSerAccountRepository {
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

  async saveWithFacebook(params: SaveUserAccountByFacebookRepository.Params): Promise<void> {
    const pgUserRepo = this.connection.getRepository(PgUser);
    if (!params.id) {
      await pgUserRepo.save({
        email: params.email,
        name: params.name,
        facebookId: params.facebookId,
      });
    } else {
      await pgUserRepo.update(
        { id: parseInt(params.id) },
        {
          name: params.name,
          facebookId: params.facebookId
        }
      )
    }
  }
}
