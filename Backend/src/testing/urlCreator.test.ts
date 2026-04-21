import { describe, expect, test } from "vitest";
import urlGenerator from "../data_generation/urlCreator";

describe("urlCreator", () => {
  test("builds expected mock API URL from inputs", () => {
    const url = urlGenerator("ABC123", "/products");
    expect(url).toBe("http://localhost:5000/api/mock/ABC123/products");
  });
});
