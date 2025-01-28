export interface LoadUSerAccountRepository {
  load: (
    params: LoadUSerAccountRepository.Params
  ) => Promise<LoadUSerAccountRepository.Result>;
}

export namespace LoadUSerAccountRepository {
  export interface Params {
    email: string;
  }

  export type Result =
    | undefined
    | {
        id: string;
        name?: string;
      };
}

export interface SaveUserAccountByFacebookRepository {
  saveWithFacebook: (
    params: SaveUserAccountByFacebookRepository.Params
  ) => Promise<SaveUserAccountByFacebookRepository.Result>;
}

export namespace SaveUserAccountByFacebookRepository {
  export interface Params {
    id?: string;
    email: string;
    name: string;
    facebookId: string;
  }

  export interface Result {
    id: string;
  }
}
