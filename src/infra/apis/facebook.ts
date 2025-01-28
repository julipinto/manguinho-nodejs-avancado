import type { LoadFacebookUserApi } from "@/data/contracts/apis";
import type { HttpGetClient } from "@/infra/http";

interface AppToken {
  access_token: string;
}

interface DebugToken {
  data: {
    user_id: string;
  };
}

interface UserInfo {
  id: string;
  name: string;
  email: string;
}

export class FacebookApi implements LoadFacebookUserApi {
  private readonly baseUrl = "https://graph.facebook.com";
  constructor(
    private readonly httpClient: HttpGetClient,
    private readonly clientId: string,
    private readonly clientSecret: string
  ) {}

  async loadUser(
    params: LoadFacebookUserApi.Params
  ): Promise<LoadFacebookUserApi.Result> {
    const userInfo = await this.getUserInfo(params.token);

    return {
      facebookId: userInfo.id,
      name: userInfo.name,
      email: userInfo.email,
    };
  }

  private async getAppToken(): Promise<AppToken> {
    return await this.httpClient.get({
      url: `${this.baseUrl}/access_token`,
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: "client_credentials",
      },
    });
  }

  private async getDebugToken(clientToken: string): Promise<DebugToken> {
    const appToken = await this.getAppToken();
    return await this.httpClient.get({
      url: `${this.baseUrl}/debug_token`,
      params: {
        access_token: appToken.access_token,
        input_token: clientToken,
      },
    });
  }

  private async getUserInfo(clientToken: string): Promise<UserInfo> {
    const debugToken = await this.getDebugToken(clientToken);
    return await this.httpClient.get({
      url: `${this.baseUrl}/${debugToken.data.user_id}`,
      params: {
        fields: "id,name,email",
        access_token: clientToken,
      },
    });
  }
}
