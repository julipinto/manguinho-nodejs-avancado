export interface LoadUSerAccountRepository {
  load: (
    params: LoadUSerAccountRepository.Params
  ) => Promise<LoadUSerAccountRepository.Result>;
}

export namespace LoadUSerAccountRepository {
  export type Params = {
    email: string;
  };

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
  export type Params = {
    id?: string;
    email: string;
    name: string;
    facebookId: string;
  };

  export type Result = {
    id: string;
  };
}
