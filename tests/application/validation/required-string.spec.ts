/* eslint-disable eslint-comments/require-description */
import { RequiredFieldError } from "@/application/errors";

class RequiredStringValidator {
  constructor(
    private readonly value: string,
    private readonly fieldName: string
  ) {}

  validate(): Error | undefined {
    return new RequiredFieldError(this.fieldName)
  }
}

describe('RequiredStringValidator', () => {
  it('should return RequiredFieldError if value is empty', () => {

    const sut = new RequiredStringValidator('', 'any_field')

    const error = sut.validate()

    expect(error).toEqual(new RequiredFieldError('any_field'))
  });

  it('should return RequiredFieldError if value is null', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-type-assertion, @typescript-eslint/no-explicit-any
    const sut = new RequiredStringValidator(null as any, 'any_field')

    const error = sut.validate()

    expect(error).toEqual(new RequiredFieldError('any_field'))
  });

  it('should return RequiredFieldError if value is undefined', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-type-assertion, @typescript-eslint/no-explicit-any
    const sut = new RequiredStringValidator(undefined as any, 'any_field')

    const error = sut.validate()

    expect(error).toEqual(new RequiredFieldError('any_field'))
  });
});
