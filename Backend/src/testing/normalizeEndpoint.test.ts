import { describe, expect, test } from "vitest";
import normalizeEndpoint from "../utils/normalizeEndpoint";

describe("normalizeEndpoint", () => {
  test("prepends slash when endpoint does not start with one", () => {
    expect(normalizeEndpoint("users")).toBe("/users");
  });

  test("keeps existing leading slash as-is", () => {
    expect(normalizeEndpoint("/users")).toBe("/users");
  });

  test("removes whitespace from paths that start with a slash", () => {
    expect(normalizeEndpoint("/ u s e r s")).toBe("/users");
  });

  test("collapses consecutive slashes into one", () => {
    expect(normalizeEndpoint("//users")).toBe("/users");
  });

  test("collapses slashes and strips spaces together", () => {
    expect(normalizeEndpoint("// users")).toBe("/users");
  });

  test("collapses multiple consecutive slashes in the middle of a path", () => {
    expect(normalizeEndpoint("/users///details")).toBe("/users/details");
  });

  test("removes backslash from paths that start with a slash", () => {
    expect(normalizeEndpoint("/users\\details")).toBe("/usersdetails");
  });

  test("normalizes a complex path with spaces, backslash and duplicate slashes", () => {
    expect(normalizeEndpoint("// pro duct")).toBe("/product");
  });

  test("returns a slash-prefixed string for an empty string input", () => {
    expect(normalizeEndpoint("")).toBe("/");
  });

  test("preserves sub-paths with multiple segments", () => {
    expect(normalizeEndpoint("/api/v1/users")).toBe("/api/v1/users");
  });
});
