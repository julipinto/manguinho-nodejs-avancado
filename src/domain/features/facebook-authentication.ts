import type { AccessToken } from "@/domain/models";
import type { AuthenticationError } from "@/domain/errors";

export interface FacebookAuthentication {
  perform: (
    params: FacebookAuthentication.Params
  ) => Promise<FacebookAuthentication.Result>;
}

export namespace FacebookAuthentication {
  export interface Params {
    token: string;
  }

  export type Result = AccessToken | AuthenticationError;
}
