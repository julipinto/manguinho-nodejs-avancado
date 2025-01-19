import { AccessToken } from "@/domain/models";

describe("AccessToken", () => {
  it("should create with a value", () => {
    const sut = new AccessToken("any_value");
    expect(sut).toEqual({ value: "any_value" });
  });

  it("should expire in 180_000 ms", () => {
    expect(AccessToken.expirationInMs).toEqual(1_800_000);
  });
});
