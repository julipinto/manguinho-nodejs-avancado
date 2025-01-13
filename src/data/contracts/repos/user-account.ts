export interface LoadUSerAccountRepository {
  load: (
    params: LoadUSerAccountRepository.Params
  ) => Promise<LoadUSerAccountRepository.Result>;
}

export namespace LoadUSerAccountRepository {
  export type Params = {
    email: string;
  };

  export type Result = undefined;
}

export interface CreateUserAccountByFacebookRepository {
  createFromFacebook: (
    params: CreateUserAccountByFacebookRepository.Params
  ) => Promise<void>;
}

export namespace CreateUserAccountByFacebookRepository {
  export type Params = {
    email: string;
    name: string;
    facebookId: string;
  };
}
