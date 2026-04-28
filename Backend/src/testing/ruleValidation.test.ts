import { describe, expect, it } from "vitest";
import {
  validateCreateRule,
  validateUpdateRule,
} from "../modules/Rules/rule.validation";

describe("validateCreateRule", () => {
  it("accepts a minimal valid rule with only an endpoint", () => {
    const result = validateCreateRule({ endpoint: "/users" });
    expect(result.endpoint).toBe("/users");
    expect(result.latency).toBe(0);
    expect(result.statusCodes).toEqual({
      "200": { weight: 100, message: "OK" },
    });
  });

  it("accepts a full valid rule payload", () => {
    const result = validateCreateRule({
      endpoint: "/orders",
      dataSchema: { id: "string.uuid" },
      latency: 500,
      statusCodes: {
        "200": { weight: 80, message: "OK" },
        "500": { weight: 20, message: "Error" },
      },
    });
    expect(result.endpoint).toBe("/orders");
    expect(result.latency).toBe(500);
  });

  it("throws when endpoint does not start with /", () => {
    expect(() => validateCreateRule({ endpoint: "users" })).toThrow();
  });

  it("throws when endpoint is empty", () => {
    expect(() => validateCreateRule({ endpoint: "" })).toThrow();
  });

  it("throws when latency is negative", () => {
    expect(() =>
      validateCreateRule({ endpoint: "/users", latency: -1 }),
    ).toThrow();
  });

  it("throws when latency exceeds 30000", () => {
    expect(() =>
      validateCreateRule({ endpoint: "/users", latency: 30001 }),
    ).toThrow();
  });

  it("throws when latency is not an integer", () => {
    expect(() =>
      validateCreateRule({ endpoint: "/users", latency: 1.5 }),
    ).toThrow();
  });

  it("throws when status code weights do not sum to 100", () => {
    expect(() =>
      validateCreateRule({
        endpoint: "/users",
        statusCodes: {
          "200": { weight: 50, message: "OK" },
        },
      }),
    ).toThrow();
  });

  it("accepts status codes whose weights sum to exactly 100", () => {
    const result = validateCreateRule({
      endpoint: "/users",
      statusCodes: {
        "200": { weight: 70, message: "OK" },
        "404": { weight: 30, message: "Not Found" },
      },
    });
    expect(result.statusCodes["200"].weight).toBe(70);
    expect(result.statusCodes["404"].weight).toBe(30);
  });

  it("throws when a status code message is empty", () => {
    expect(() =>
      validateCreateRule({
        endpoint: "/users",
        statusCodes: {
          "200": { weight: 100, message: "" },
        },
      }),
    ).toThrow();
  });

  it("throws when endpoint field is missing", () => {
    expect(() => validateCreateRule({})).toThrow();
  });
});

describe("validateUpdateRule", () => {
  it("accepts a valid partial update with only an endpoint", () => {
    const result = validateUpdateRule({ endpoint: "/products" });
    expect(result.endpoint).toBe("/products");
  });

  it("accepts a valid partial update with only a dataSchema", () => {
    const result = validateUpdateRule({
      dataSchema: { name: "person.fullName" },
    });
    expect(result.dataSchema).toEqual({ name: "person.fullName" });
  });

  it("accepts a valid partial update with valid statusCodes", () => {
    const result = validateUpdateRule({
      statusCodes: {
        "200": { weight: 60, message: "OK" },
        "400": { weight: 40, message: "Bad Request" },
      },
    });
    expect(result.statusCodes?.["200"].weight).toBe(60);
  });

  it("throws when the body is completely empty", () => {
    expect(() => validateUpdateRule({})).toThrow();
  });

  it("throws when updated endpoint does not start with /", () => {
    expect(() => validateUpdateRule({ endpoint: "products" })).toThrow();
  });

  it("throws when updated endpoint is an empty string", () => {
    expect(() => validateUpdateRule({ endpoint: "" })).toThrow();
  });

  it("throws when updated status code weights do not sum to 100", () => {
    expect(() =>
      validateUpdateRule({
        statusCodes: {
          "200": { weight: 50, message: "OK" },
        },
      }),
    ).toThrow();
  });
});
