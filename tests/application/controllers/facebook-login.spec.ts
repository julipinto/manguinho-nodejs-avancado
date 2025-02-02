import { FacebookLoginController } from "@/application/controllers";
import { UnauthorizedError } from "@/application/errors/http";
import { RequiredStringValidator } from "@/application/validation";
import { AuthenticationError } from "@/domain/errors";
import type { FacebookAuthentication } from "@/domain/features";
import { AccessToken } from "@/domain/models";
import { mock, type MockProxy } from "jest-mock-extended";

describe('FacebookLoginController', () => {
  let sut: FacebookLoginController;
  let facebookAuth: MockProxy<FacebookAuthentication>;
  let token: string

  beforeAll(() => {
    token = 'any_token';
    facebookAuth = mock();
    facebookAuth.perform.mockResolvedValue(new AccessToken('any_value'));
  });

   beforeEach(() => {
    sut = new FacebookLoginController(facebookAuth);
   });

  it('should build validators correctly', async () => {
    const validators = sut.buildValidators({ token })

    expect(validators).toEqual([
      new RequiredStringValidator(token, 'token')
    ])
  });

  it('should call FacebookAuthentication with correct params', async () => {
    await sut.handle({ token })

    expect(facebookAuth.perform).toHaveBeenCalledWith({ token })
    expect(facebookAuth.perform).toHaveBeenCalledTimes(1)
  });

  it('should return 401 authentication fails', async () => {
    facebookAuth.perform.mockResolvedValueOnce(new AuthenticationError())
    const httpResponse = await sut.handle({ token: "any_token" })

    expect(httpResponse).toEqual({
      statusCode: 401,
      data: new UnauthorizedError()
    });
  });

  it('should return 200 authentication success', async () => {
    const httpResponse = await sut.handle({ token: "any_token" })

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: { accessToken: 'any_value' }
    });
  });
});
