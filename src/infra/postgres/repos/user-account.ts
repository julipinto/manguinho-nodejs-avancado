import { LoadUSerAccountRepository, SaveUserAccountByFacebookRepository } from "@/data/contracts/repos";
import { PgUser } from "@/infra/postgres/entities";

import { DataSource, Repository } from "typeorm";

type LoadParams = LoadUSerAccountRepository.Params
type LoadResult = LoadUSerAccountRepository.Result

type SaveParams = SaveUserAccountByFacebookRepository.Params

export class PgUserAccountRepository implements LoadUSerAccountRepository {
  private pgUserRepo: Repository<PgUser>;
  constructor(private readonly connection: DataSource) {
    this.pgUserRepo = this.connection.getRepository(PgUser)
  }

  async load(params: LoadParams): Promise<LoadResult> {
    const pgUser = await this.pgUserRepo.findOneBy({ email: params.email });
    if (!!pgUser) {
      return {
        id: pgUser?.id?.toString(),
        name: pgUser.name ?? undefined,
      }
    }
  }

  async saveWithFacebook(params: SaveParams): Promise<void> {
    if (!params.id) {
      await this.pgUserRepo.save({
        email: params.email,
        name: params.name,
        facebookId: params.facebookId,
      });
    } else {
      await this.pgUserRepo.update(
        { id: parseInt(params.id) },
        {
          name: params.name,
          facebookId: params.facebookId
        }
      )
    }
  }
}
