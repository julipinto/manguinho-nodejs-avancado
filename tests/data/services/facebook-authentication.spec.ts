import { LoadFacebookUserApi } from "@/data/contracts/apis";
import { FacebookAuthenticationService } from "@/data/services/facebook-authentication";
import { AuthenticationError } from "@/domain/errors";
import { mock, MockProxy } from "jest-mock-extended";

describe("FacebookAuthentication", () => {
  let loadFacebookApi: MockProxy<LoadFacebookUserApi>;
  let sut: FacebookAuthenticationService;
  const token = "any_token";

  beforeEach(() => {
    loadFacebookApi = mock<LoadFacebookUserApi>();
    sut = new FacebookAuthenticationService(loadFacebookApi);
  });

  it("should call LoadFacebookUserApi with correct params", async () => {
    await sut.perform({ token });
    expect(loadFacebookApi.loadUser).toHaveBeenCalledWith({
      token: "any_token",
    });
    expect(loadFacebookApi.loadUser).toHaveBeenCalledTimes(1);
  });

  it("should return AuthenticationError when loadFacebookUserApi return undefined", async () => {
    loadFacebookApi.loadUser.mockResolvedValueOnce(undefined);
    const authResult = await sut.perform({ token });
    expect(authResult).toEqual(new AuthenticationError());
  });
});
