import { describe, expect, test } from "vitest";
import { updateVersion } from "../modules/Rules/updateVersion";

describe("updateVersion", () => {
  test("increments v1 to v2", () => {
    expect(updateVersion("v1")).toBe("v2");
  });

  test("increments a larger version number", () => {
    expect(updateVersion("v10")).toBe("v11");
  });

  test("increments v0 to v1", () => {
    expect(updateVersion("v0")).toBe("v1");
  });

  test("handles a very large version number", () => {
    expect(updateVersion("v99")).toBe("v100");
  });

  test("is case-insensitive and accepts uppercase V", () => {
    expect(updateVersion("V1")).toBe("v2");
  });

  test("trims surrounding whitespace before matching", () => {
    expect(updateVersion("  v3  ")).toBe("v4");
  });

  test("returns v2 for a non-versioned string", () => {
    expect(updateVersion("invalid")).toBe("v2");
  });

  test("returns v2 for an empty string", () => {
    expect(updateVersion("")).toBe("v2");
  });

  test("returns v2 when the version string has extra characters", () => {
    expect(updateVersion("v1beta")).toBe("v2");
  });

  test("returns v2 when no version prefix is present", () => {
    expect(updateVersion("42")).toBe("v2");
  });
});
