import { describe, expect, it } from "vitest";
import {
  validateRegister,
  validateLogin,
} from "../modules/Auth/auth.validation";

describe("validateRegister", () => {
  it("accepts valid registration data", () => {
    const result = validateRegister({
      name: "Alice",
      email: "alice@example.com",
      password: "secret123",
    });
    expect(result.name).toBe("Alice");
    expect(result.email).toBe("alice@example.com");
    expect(result.password).toBe("secret123");
  });

  it("throws when name is shorter than 2 characters", () => {
    expect(() =>
      validateRegister({
        name: "A",
        email: "alice@example.com",
        password: "secret123",
      }),
    ).toThrow();
  });

  it("throws when email is not a valid email address", () => {
    expect(() =>
      validateRegister({
        name: "Alice",
        email: "not-an-email",
        password: "secret123",
      }),
    ).toThrow();
  });

  it("throws when password is shorter than 6 characters", () => {
    expect(() =>
      validateRegister({
        name: "Alice",
        email: "alice@example.com",
        password: "abc",
      }),
    ).toThrow();
  });

  it("throws when required fields are missing", () => {
    expect(() => validateRegister({ name: "Alice" })).toThrow();
  });

  it("throws when the body is empty", () => {
    expect(() => validateRegister({})).toThrow();
  });
});

describe("validateLogin", () => {
  it("accepts valid login data", () => {
    const result = validateLogin({
      email: "alice@example.com",
      password: "secret123",
    });
    expect(result.email).toBe("alice@example.com");
    expect(result.password).toBe("secret123");
  });

  it("throws when email is not a valid email address", () => {
    expect(() =>
      validateLogin({ email: "bad-email", password: "secret123" }),
    ).toThrow();
  });

  it("throws when password is shorter than 6 characters", () => {
    expect(() =>
      validateLogin({ email: "alice@example.com", password: "abc" }),
    ).toThrow();
  });

  it("throws when password is missing", () => {
    expect(() => validateLogin({ email: "alice@example.com" })).toThrow();
  });

  it("throws when email is missing", () => {
    expect(() => validateLogin({ password: "secret123" })).toThrow();
  });

  it("throws when body is empty", () => {
    expect(() => validateLogin({})).toThrow();
  });
});
