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
export interface UpdateUserAccountByFacebookRepository {
  updateWithFacebook: (
    params: UpdateUserAccountByFacebookRepository.Params
  ) => Promise<void>;
}

export namespace UpdateUserAccountByFacebookRepository {
  export type Params = {
    id: string;
    name: string;
    facebookId: string;
  };
}
