import { LoadUSerAccountRepository, SaveUserAccountByFacebookRepository } from "@/data/contracts/repos";
import { PgUser } from "@/infra/postgres/entities";

import { DataSource, Repository } from "typeorm";

type LoadParams = LoadUSerAccountRepository.Params
type LoadResult = LoadUSerAccountRepository.Result

type SaveParams = SaveUserAccountByFacebookRepository.Params
type SaveResult = SaveUserAccountByFacebookRepository.Result

export class PgUserAccountRepository implements LoadUSerAccountRepository, SaveUserAccountByFacebookRepository {
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

  async saveWithFacebook(params: SaveParams): Promise<SaveResult> {
    let id: string
    if (!params.id) {
      const pgUser = await this.pgUserRepo.save({
        email: params.email,
        name: params.name,
        facebookId: params.facebookId,
      });

      id = pgUser.id.toString()
    } else {
      id = params.id
      await this.pgUserRepo.update(
        { id: parseInt(params.id) },
        {
          name: params.name,
          facebookId: params.facebookId
        }
      )
    }

    return { id }
  }
}
