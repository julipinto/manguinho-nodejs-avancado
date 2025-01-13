import { LoadFacebookUserApi } from "@/data/contracts/apis";
import { LoadUSerAccountRepository } from "@/data/contracts/repos";
import { FacebookAuthenticationService } from "@/data/services/facebook-authentication";
import { AuthenticationError } from "@/domain/errors";
import { mock, MockProxy } from "jest-mock-extended";

describe("FacebookAuthentication", () => {
  let loadFacebookApi: MockProxy<LoadFacebookUserApi>;
  let loadUserAccountRepo: MockProxy<LoadUSerAccountRepository>;
  let sut: FacebookAuthenticationService;
  const token = "any_token";

  beforeEach(() => {
    loadFacebookApi = mock<LoadFacebookUserApi>();
    loadUserAccountRepo = mock<LoadUSerAccountRepository>();
    loadFacebookApi.loadUser.mockResolvedValue({
      name: "any_facekook_ name",
      email: "any_facekook_ email",
      facebookId: "any_facekoob_ id",
    });
    sut = new FacebookAuthenticationService(
      loadFacebookApi,
      loadUserAccountRepo
    );
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

  it("should call loadUserAccountRepo when loadFacebookUserApi returns data", async () => {
    const authResult = await sut.perform({ token });
    expect(loadUserAccountRepo.load).toHaveBeenCalledWith({
      email: "any_facekook_ email",
    });
    expect(loadUserAccountRepo.load).toHaveBeenCalledTimes(1);
  });
});
