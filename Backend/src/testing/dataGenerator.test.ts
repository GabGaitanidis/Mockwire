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
});
