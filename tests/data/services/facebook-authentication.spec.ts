import { LoadFacebookUserApi } from "@/data/contracts/apis";
import {
  CreateUserAccountByFacebookRepository,
  LoadUSerAccountRepository,
} from "@/data/contracts/repos";
import { FacebookAuthenticationService } from "@/data/services/facebook-authentication";
import { AuthenticationError } from "@/domain/errors";
import { mock, MockProxy } from "jest-mock-extended";

describe("FacebookAuthentication", () => {
  let loadFacebookApi: MockProxy<LoadFacebookUserApi>;
  let loadUserAccountRepo: MockProxy<LoadUSerAccountRepository>;
  let createUserAccountByFacebookRepo: MockProxy<CreateUserAccountByFacebookRepository>;
  let sut: FacebookAuthenticationService;
  const token = "any_token";

  beforeEach(() => {
    loadFacebookApi = mock();
    loadFacebookApi.loadUser.mockResolvedValue({
      name: "any_fb_name",
      email: "any_fb_email",
      facebookId: "any_fb_id",
    });

    loadUserAccountRepo = mock();
    createUserAccountByFacebookRepo = mock();

    sut = new FacebookAuthenticationService(
      loadFacebookApi,
      loadUserAccountRepo,
      createUserAccountByFacebookRepo
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
    await sut.perform({ token });
    expect(loadUserAccountRepo.load).toHaveBeenCalledWith({
      email: "any_fb_email",
    });
    expect(loadUserAccountRepo.load).toHaveBeenCalledTimes(1);
  });

  it("should call createUserAccountRepo when loadFacebookUserApi returns undefined", async () => {
    loadUserAccountRepo.load.mockResolvedValueOnce(undefined);
    await sut.perform({ token });

    expect(
      createUserAccountByFacebookRepo.createFromFacebook
    ).toHaveBeenCalledWith({
      email: "any_fb_email",
      name: "any_fb_name",
      facebookId: "any_fb_id",
    });
    expect(
      createUserAccountByFacebookRepo.createFromFacebook
    ).toHaveBeenCalledTimes(1);
  });
});
