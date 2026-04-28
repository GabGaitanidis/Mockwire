import { describe, expect, it, vi } from "vitest";
import pickRandomStatusCode from "../data_generation/statusCodePick";

describe("pickRandomStatusCode", () => {
  it("returns default 200 OK when statusCodes is empty", () => {
    const result = pickRandomStatusCode({});
    expect(result).toEqual({ error: false, code: 200, message: "OK" });
  });

  it("always returns the only entry when a single code with weight 100 is given", () => {
    const result = pickRandomStatusCode({
      "200": { weight: 100, message: "OK" },
    });
    expect(result).toEqual({ error: false, code: 200, message: "OK" });
  });

  it("sets error to false for 2xx codes", () => {
    const result = pickRandomStatusCode({
      "201": { weight: 100, message: "Created" },
    });
    expect(result.error).toBe(false);
    expect(result.code).toBe(201);
  });

  it("sets error to true for 4xx codes", () => {
    const result = pickRandomStatusCode({
      "404": { weight: 100, message: "Not Found" },
    });
    expect(result.error).toBe(true);
    expect(result.code).toBe(404);
  });

  it("sets error to true for 5xx codes", () => {
    const result = pickRandomStatusCode({
      "500": { weight: 100, message: "Internal Server Error" },
    });
    expect(result.error).toBe(true);
    expect(result.code).toBe(500);
  });

  it("sets error to false for 3xx codes", () => {
    const result = pickRandomStatusCode({
      "301": { weight: 100, message: "Moved Permanently" },
    });
    expect(result.error).toBe(false);
    expect(result.code).toBe(301);
  });

  it("returns a valid entry from multiple weighted codes", () => {
    const statusCodes = {
      "200": { weight: 70, message: "OK" },
      "404": { weight: 30, message: "Not Found" },
    };
    const result = pickRandomStatusCode(statusCodes);
    expect([200, 404]).toContain(result.code);
    expect(result.message).toBeDefined();
    expect(typeof result.error).toBe("boolean");
  });

  it("returns correct message string from the selected status code", () => {
    const result = pickRandomStatusCode({
      "418": { weight: 100, message: "I'm a teapot" },
    });
    expect(result.message).toBe("I'm a teapot");
    expect(result.code).toBe(418);
    expect(result.error).toBe(true);
  });

  it("deterministically picks the only code when random is fixed to 0", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const result = pickRandomStatusCode({
      "200": { weight: 50, message: "OK" },
      "500": { weight: 50, message: "Error" },
    });
    expect(result.code).toBe(200);
    vi.restoreAllMocks();
  });

  it("picks the second code when random falls in second weight bucket", () => {
    // totalWeight = 100, random = 0.6 * 100 = 60 → first cumulative = 50 < 60 → second
    vi.spyOn(Math, "random").mockReturnValue(0.6);
    const result = pickRandomStatusCode({
      "200": { weight: 50, message: "OK" },
      "500": { weight: 50, message: "Error" },
    });
    expect(result.code).toBe(500);
    vi.restoreAllMocks();
  });

  it("falls back to the first entry when all weights are zero", () => {
    const result = pickRandomStatusCode({
      "200": { weight: 0, message: "OK" },
      "404": { weight: 0, message: "Not Found" },
    });
    // totalWeight = 0, so random * (0 || 1) = random * 1
    // cumulativeWeight never increases past 0, so fallback fires
    expect(result.code).toBe(200);
    expect(result.message).toBe("OK");
  });

  it("returns numeric code (not a string) for the selected entry", () => {
    const result = pickRandomStatusCode({
      "202": { weight: 100, message: "Accepted" },
    });
    expect(typeof result.code).toBe("number");
    expect(result.code).toBe(202);
  });
});
