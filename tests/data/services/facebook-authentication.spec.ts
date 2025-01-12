import { LoadFacebookUserApi } from "@/data/contracts/apis";
import { FacebookAuthenticationService } from "@/data/services/facebook-authentication";
import { AuthenticationError } from "@/domain/errors";
import { mock } from "jest-mock-extended";

describe("FacebookAuthentication", () => {
  it("should call LoadFacebookUserApi with correct params", async () => {
    const loadFacebookApi = mock<LoadFacebookUserApi>();
    const sut = new FacebookAuthenticationService(loadFacebookApi);
    await sut.perform({ token: "any_token" });
    expect(loadFacebookApi.loadUser).toHaveBeenCalledWith({
      token: "any_token",
    });
    expect(loadFacebookApi.loadUser).toHaveBeenCalledTimes(1);
  });

  it("should return AuthenticationError when loadFacebookUserApi return undefined", async () => {
    const loadFacebookApi = mock<LoadFacebookUserApi>();
    loadFacebookApi.loadUser.mockResolvedValueOnce(undefined);
    const sut = new FacebookAuthenticationService(loadFacebookApi);
    const authResult = await sut.perform({ token: "any_token" });
    expect(authResult).toEqual(new AuthenticationError());
  });
});
