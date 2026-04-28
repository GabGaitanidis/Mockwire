import pickRandomStatusCode from "../data_generation/statusCodePick";
import { it, describe, expect } from "vitest";

describe("Status Code Selection", () => {
  it("Returns 200 code default", () => {
    const result = pickRandomStatusCode({});
    expect(result).toMatchObject({
      error: false,
      code: 200,
      message: "OK",
    });
  });
  it("Error: true when code >= 400", () => {
    const result = pickRandomStatusCode({
      "400": { weight: 100, message: "error" },
    });
    expect(result.error).toBe(true);
  });
  it("Error: true when code < 400", () => {
    const result = pickRandomStatusCode({
      "300": { weight: 100, message: "not error" },
    });
    expect(result.error).toBe(false);
  });
  it("falls back to the first entry when all weights are zero", () => {
    const result = pickRandomStatusCode({
      "200": { weight: 0, message: "OK" },
      "404": { weight: 0, message: "Not Found" },
    });
    expect(result.code).toBe(200);
    expect(result.message).toBe("OK");
  });
});
