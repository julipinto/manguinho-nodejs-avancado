import type { LoadFacebookUserApi } from "@/data/contracts/apis";
import type {
  SaveUserAccountByFacebookRepository,
  LoadUSerAccountRepository,
} from "@/data/contracts/repos";
import type { TokenGenerator } from "@/data/contracts/crypto";
import { FacebookAuthenticationService } from "@/data/services/facebook-authentication";
import { AuthenticationError } from "@/domain/errors";
import { AccessToken, FacebookAccount } from "@/domain/models";

import { mock, type MockProxy } from "jest-mock-extended";
import { mocked } from "jest-mock";

jest.mock("@/domain/models/facebook-account");

// ARRANGE AT ASSERT

describe("FacebookAuthentication", () => {
  let facebookApi: MockProxy<LoadFacebookUserApi>;
  let crypto: MockProxy<TokenGenerator>;
  let userAccountRepo: MockProxy<LoadUSerAccountRepository> &
    MockProxy<SaveUserAccountByFacebookRepository>;
  let sut: FacebookAuthenticationService;
  let token: string;

  beforeAll(() => {
    token = "any_token";

    facebookApi = mock();
    facebookApi.loadUser.mockResolvedValue({
      name: "any_fb_name",
      email: "any_fb_email",
      facebookId: "any_fb_id",
    });

    userAccountRepo = mock();
    userAccountRepo.load.mockResolvedValue(undefined);
    userAccountRepo.saveWithFacebook.mockResolvedValue({
      id: "any_account_id",
    });

    crypto = mock();
    crypto.generateToken.mockResolvedValue("any_generated_token");
  });

  beforeEach(() => {
    sut = new FacebookAuthenticationService(
      facebookApi,
      userAccountRepo,
      crypto
    );
  });

  it("should call LoadFacebookUserApi with correct params", async () => {
    await sut.perform({ token });

    expect(facebookApi.loadUser).toHaveBeenCalledWith({
      token: "any_token",
    });
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1);
  });

  it("should return AuthenticationError when loadFacebookUserApi return undefined", async () => {
    facebookApi.loadUser.mockResolvedValueOnce(undefined);
    const authResult = await sut.perform({ token });
    expect(authResult).toEqual(new AuthenticationError());
  });

  it("should call loadUserAccountRepo when loadFacebookUserApi returns data", async () => {
    await sut.perform({ token });
    expect(userAccountRepo.load).toHaveBeenCalledWith({
      email: "any_fb_email",
    });
    expect(userAccountRepo.load).toHaveBeenCalledTimes(1);
  });

  it("should call SaveUserAccountByFacebookRepository with FacebookAccount", async () => {
    const FacebookAccountStub = jest
      .fn()
      .mockImplementation(() => ({ any: "any" }));

    mocked(FacebookAccount).mockImplementation(FacebookAccountStub);

    await sut.perform({ token });

    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({
      any: "any",
    });
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1);
  });

  it("should call TokenGenerator with correct params", async () => {
    await sut.perform({ token });

    expect(crypto.generateToken).toHaveBeenCalledWith({
      key: "any_account_id",
      expirationInMs: AccessToken.expirationInMs,
    });
    expect(crypto.generateToken).toHaveBeenCalledTimes(1);
  });

  it("should return an AccessToken on success", async () => {
    const authResult = await sut.perform({ token });

    expect(authResult).toEqual(new AccessToken("any_generated_token"));
  });

  it("should rethrow if LoadFacebookUserApi throws", async () => {
    facebookApi.loadUser.mockRejectedValueOnce(new Error("fb_error"));

    const promise = sut.perform({ token });

    await expect(promise).rejects.toThrow(new Error("fb_error"));
  });

  it("should rethrow if LoadUSerAccountRepository throws", async () => {
    userAccountRepo.load.mockRejectedValueOnce(new Error("load_error"));

    const promise = sut.perform({ token });

    await expect(promise).rejects.toThrow(new Error("load_error"));
  });

  it("should rethrow if SaveUserAccountByFacebookRepository throws", async () => {
    userAccountRepo.saveWithFacebook.mockRejectedValueOnce(
      new Error("save_error")
    );

    const promise = sut.perform({ token });

    await expect(promise).rejects.toThrow(new Error("save_error"));
  });

  it("should rethrow if TokenGenerator throws", async () => {
    crypto.generateToken.mockRejectedValueOnce(new Error("token_error"));

    const promise = sut.perform({ token });

    await expect(promise).rejects.toThrow(new Error("token_error"));
  });
});
