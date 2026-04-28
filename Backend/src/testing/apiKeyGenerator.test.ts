import { describe, test, expect } from "vitest";
import { generateApiKey } from "../data_generation/apiKeyGenerator";

describe("API Key Generator", () => {
  test("API Key has 32 length", () => {
    const key = generateApiKey();
    expect(key).length(64);
    expect(typeof key).toBe("string");
  });
  test("generates unique keys on successive calls", () => {
    const keys = new Set(Array.from({ length: 10 }, () => generateApiKey()));
    expect(keys.size).toBe(10);
  });
});
