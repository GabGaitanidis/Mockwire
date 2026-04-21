import { describe, expect, test } from "vitest";
import dataGenerator from "../data_generation/dataGenerator";

describe("dataGenerator", () => {
  test("generates attributes based on faker schema map", () => {
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

  test("keeps fixed values and only resolves valid faker paths", () => {
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
});
