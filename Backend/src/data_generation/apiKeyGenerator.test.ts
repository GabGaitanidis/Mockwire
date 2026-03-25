import { describe, test, expect } from "vitest";
import { generateApiKey } from "./apiKeyGenerator";

describe("API Key Generator", () => {
  test("API Key has 32 length", () => {
    const key = generateApiKey();
    expect(key).length(64);
    expect(typeof key).toBe("string");
  });
});
