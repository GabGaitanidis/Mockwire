import { describe, expect, test } from "vitest";
import urlGenerator from "../data_generation/urlCreator";
import normalizeEndpoint from "../utils/normalizeEndpoint";

describe("Url Creation with normalized endpoint", () => {
  test("builds expected mock API URL from inputs", () => {
    let endpoint = "// product";
    const cleanEndpoint = normalizeEndpoint(endpoint);
    console.log(cleanEndpoint);
    const url = urlGenerator("ABC123", cleanEndpoint);
    expect(url).toBe("http://localhost:5000/dynamics/api/mock/ABC123/product");
    expect(cleanEndpoint).toBe("/product");
  });
});
