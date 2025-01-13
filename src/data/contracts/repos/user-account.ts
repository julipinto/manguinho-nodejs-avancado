export interface LoadUSerAccountRepository {
  load: (params: LoadUSerAccountRepository.Params) => Promise<void>;
}

export namespace LoadUSerAccountRepository {
  export type Params = {
    email: string;
  };
}
