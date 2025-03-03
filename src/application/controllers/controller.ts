import type { HttpResponse } from "@/application/helpers";
import { badRequest, serverError } from "@/application/helpers";
import { ValidationComposite, type Validator } from "@/application/validation";

export abstract class Controller {
  abstract perform(httpRequest: any): Promise<HttpResponse>

  buildValidators(httpRequest: any): Validator[] {
    return []
  }

  async handle(httpRequest: any): Promise<HttpResponse> {
    const error = this.validate(httpRequest);
    if (error !== undefined) {
      return badRequest(error);
    }

    try {
      return await this.perform(httpRequest)
    } catch (error) {
      return serverError(error as Error)
    }
  }

  private validate(httpRequest: any): Error | undefined {
    const validators = this.buildValidators(httpRequest)
    return new ValidationComposite(validators).validate()
  }
}
