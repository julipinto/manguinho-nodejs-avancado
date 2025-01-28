import { RequiredFieldError } from "@/application/errors/http";
import type { HttpResponse } from "@/application/helpers";
import { badRequest, serverError, unauthorized } from "@/application/helpers";
import type { FacebookAuthentication } from "@/domain/features";
import { AccessToken } from "@/domain/models";

export class FacebookLoginController {
  constructor(private readonly facebookAuthentication: FacebookAuthentication) {}

  async handle(httpRequest: any): Promise<HttpResponse> {
    try {
      if (httpRequest.token === '' || httpRequest.token === null || httpRequest.token === undefined) {
        return badRequest(new RequiredFieldError('token'));
      }

      const accessToken = await this.facebookAuthentication.perform({ token: httpRequest.token });
      if (accessToken instanceof AccessToken) {
        return {
          statusCode: 200,
          data: { accessToken: accessToken.value }
        }
      }

      return unauthorized()

    } catch (error) {
      return serverError(error as Error)
    }
  }
}
