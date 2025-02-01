import { mock } from "jest-mock-extended";


interface Validator {
  validate: () => Error | undefined
}

class ValidationComposite {
  constructor(private readonly validators: Validator[]) {}

  validate(): Error | undefined {
    return undefined
  }
}

describe('ValidationComposite', () => {
  it('should return undefined if all validators returns undefined', () => {
    const validator1 = mock<Validator>()
    validator1.validate.mockReturnValue(undefined)
    const validator2 = mock<Validator>()
    validator2.validate.mockReturnValue(undefined)

    const sut = new ValidationComposite([validator1, validator2])

    const error = sut.validate()

    expect(error).toBeUndefined()
  });
});
