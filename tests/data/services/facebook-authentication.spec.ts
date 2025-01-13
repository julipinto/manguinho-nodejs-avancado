import { LoadFacebookUserApi } from "@/data/contracts/apis";
import { FacebookAuthenticationService } from "@/data/services/facebook-authentication";
import { AuthenticationError } from "@/domain/errors";
import { mock, MockProxy } from "jest-mock-extended";

type SutTypes = {
  sut: FacebookAuthenticationService;
  loadFacebookApi: MockProxy<LoadFacebookUserApi>;
};

function makeSut(): SutTypes {
  const loadFacebookApi = mock<LoadFacebookUserApi>();
  const sut = new FacebookAuthenticationService(loadFacebookApi);
  return {
    sut,
    loadFacebookApi,
  };
}

describe("FacebookAuthentication", () => {
  it("should call LoadFacebookUserApi with correct params", async () => {
    const { sut, loadFacebookApi } = makeSut();
    await sut.perform({ token: "any_token" });
    expect(loadFacebookApi.loadUser).toHaveBeenCalledWith({
      token: "any_token",
    });
    expect(loadFacebookApi.loadUser).toHaveBeenCalledTimes(1);
  });

  it("should return AuthenticationError when loadFacebookUserApi return undefined", async () => {
    const { sut, loadFacebookApi } = makeSut();
    loadFacebookApi.loadUser.mockResolvedValueOnce(undefined);
    const authResult = await sut.perform({ token: "any_token" });
    expect(authResult).toEqual(new AuthenticationError());
  });
});
