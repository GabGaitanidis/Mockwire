import { describe, expect, it, test } from "vitest";
import dataGenerator from "../data_generation/dataGenerator";

describe("dataGenerator", () => {
  it("generates attributes based on faker schema map", () => {
    const data = dataGenerator({
      firstName: "person.firstName",
      email: "internet.email",
      city: "location.city",
    });

    expect(data).toHaveProperty("firstName");
    expect(data).toHaveProperty("email");
    expect(data).toHaveProperty("city");

    expect(typeof data.firstName).toBe("string");
    expect(typeof data.email).toBe("string");
    expect(typeof data.city).toBe("string");
  });

  it("keeps fixed values and only resolves valid faker paths", () => {
    const data = dataGenerator({
      status: "active",
      count: 42,
      isEnabled: true,
      displayName: "person.fullName",
      meta: {
        source: "manual",
        score: 9.7,
        city: "location.city",
      },
      tags: ["fixed", "internet.domainWord", 10],
    });

    expect(data.status).toBe("active");
    expect(data.count).toBe(42);
    expect(data.isEnabled).toBe(true);

    expect(typeof data.displayName).toBe("string");

    expect(data.meta).toMatchObject({
      source: "manual",
      score: 9.7,
    });
    expect(typeof (data.meta as { city: unknown }).city).toBe("string");

    expect(Array.isArray(data.tags)).toBe(true);
    expect((data.tags as unknown[])[0]).toBe("fixed");
    expect(typeof (data.tags as unknown[])[1]).toBe("string");
    expect((data.tags as unknown[])[2]).toBe(10);
  });

  test("ignores conditions key in the output and applies matching conditions", () => {
    const data = dataGenerator({
      age: 21,
      name: "person.fullName",
      conditions: [
        {
          if: { age: ">= 18" },
          then: {
            status: "adult",
            accessLevel: "full",
          },
        },
      ],
    });

    expect(data).toMatchObject({
      age: 21,
      status: "adult",
      accessLevel: "full",
    });
    expect(data).not.toHaveProperty("conditions");
    expect(data).not.toHaveProperty("then");
    expect(typeof data.name).toBe("string");
  });

  test("merges then values into the mock data object when the condition matches", () => {
    const data = dataGenerator({
      age: 30,
      conditions: [
        {
          if: { age: ">= 18" },
          then: {
            role: "adult",
            canVote: true,
          },
        },
      ],
    });

    expect(data).toMatchObject({
      age: 30,
      role: "adult",
      canVote: true,
    });
    expect(data).not.toHaveProperty("then");
  });

  test("does not apply conditions when the condition fails", () => {
    const data = dataGenerator({
      age: 16,
      conditions: [
        {
          if: { age: ">= 18" },
          then: {
            status: "adult",
          },
        },
      ],
    });

    expect(data).toMatchObject({
      age: 16,
    });
    expect(data).not.toHaveProperty("status");
    expect(data).not.toHaveProperty("conditions");
  });

  test("applies multiple matching conditions and merges all their then values", () => {
    const data = dataGenerator({
      age: 25,
      score: 90,
      conditions: [
        {
          if: { age: ">= 18" },
          then: { isAdult: true },
        },
        {
          if: { score: "> 80" },
          then: { grade: "A" },
        },
      ],
    });

    expect(data).toMatchObject({ age: 25, score: 90, isAdult: true, grade: "A" });
    expect(data).not.toHaveProperty("conditions");
  });

  test("only applies conditions that pass when multiple are present", () => {
    const data = dataGenerator({
      age: 15,
      score: 90,
      conditions: [
        {
          if: { age: ">= 18" },
          then: { isAdult: true },
        },
        {
          if: { score: "> 80" },
          then: { grade: "A" },
        },
      ],
    });

    expect(data).not.toHaveProperty("isAdult");
    expect(data).toMatchObject({ grade: "A" });
  });

  test("evaluates strict less-than operator correctly", () => {
    const data = dataGenerator({
      price: 5,
      conditions: [
        {
          if: { price: "< 10" },
          then: { label: "cheap" },
        },
      ],
    });

    expect(data).toMatchObject({ price: 5, label: "cheap" });
  });

  test("does not apply condition when strict less-than fails", () => {
    const data = dataGenerator({
      price: 15,
      conditions: [
        {
          if: { price: "< 10" },
          then: { label: "cheap" },
        },
      ],
    });

    expect(data).not.toHaveProperty("label");
  });

  test("evaluates equality operator == correctly", () => {
    const data = dataGenerator({
      status: 1,
      conditions: [
        {
          if: { status: "== 1" },
          then: { statusLabel: "active" },
        },
      ],
    });

    expect(data).toMatchObject({ statusLabel: "active" });
  });

  test("evaluates inequality operator != correctly", () => {
    const data = dataGenerator({
      role: 2,
      conditions: [
        {
          if: { role: "!= 1" },
          then: { isGuest: true },
        },
      ],
    });

    expect(data).toMatchObject({ isGuest: true });
  });

  test("does not apply condition when != operator fails", () => {
    const data = dataGenerator({
      role: 1,
      conditions: [
        {
          if: { role: "!= 1" },
          then: { isGuest: true },
        },
      ],
    });

    expect(data).not.toHaveProperty("isGuest");
  });

  test("does not apply condition when the referenced field is missing", () => {
    const data = dataGenerator({
      name: "person.fullName",
      conditions: [
        {
          if: { missingField: ">= 18" },
          then: { extra: "value" },
        },
      ],
    });

    expect(data).not.toHaveProperty("extra");
    expect(data).not.toHaveProperty("conditions");
  });

  test("returns an empty object when schema has no keys", () => {
    const data = dataGenerator({});
    expect(data).toEqual({});
  });

  test("resolves nested faker path inside an array element", () => {
    const data = dataGenerator({
      tags: ["fixed", "internet.domainWord"],
    });

    expect(Array.isArray((data as any).tags)).toBe(true);
    expect((data as any).tags[0]).toBe("fixed");
    expect(typeof (data as any).tags[1]).toBe("string");
  });

  test("returns original string value when faker path cannot be resolved", () => {
    const data = dataGenerator({ key: "nonexistent.fakepath.xyz" });
    expect((data as any).key).toBe("nonexistent.fakepath.xyz");
  });
});
