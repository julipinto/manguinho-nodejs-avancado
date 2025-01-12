import { FacebookAuthenticationService } from "@/data/services/facebook-authentication";
import { LoadFacebookUserApi } from "@/data/contracts/apis";
import { AuthenticationError } from "@/domain/errors";

class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
  token?: string;
  result = undefined;
  async loadUser(
    params: LoadFacebookUserApi.Params
  ): Promise<LoadFacebookUserApi.Result> {
    this.token = params.token;
    return this.result;
  }
}

describe("FacebookAuthentication", () => {
  it("should call LoadFacebookUserApi with correct params", async () => {
    const loadFacebookApi = new LoadFacebookUserApiSpy();
    const sut = new FacebookAuthenticationService(loadFacebookApi);
    await sut.perform({ token: "any_token" });
    expect(loadFacebookApi.token).toBe("any_token");
  });

  it("should return AuthenticationError when loadFacebookUserApi return undefined", async () => {
    const loadFacebookApi = new LoadFacebookUserApiSpy();
    loadFacebookApi.result = undefined;
    const sut = new FacebookAuthenticationService(loadFacebookApi);
    const authResult = await sut.perform({ token: "any_token" });
    expect(authResult).toEqual(new AuthenticationError());
  });
});
