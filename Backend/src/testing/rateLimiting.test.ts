import request from "supertest";
import app from "../app";
import { describe, expect, it } from "vitest";

const LIMIT = 60;

function mockRoute(apiKey: string) {
  return `/dynamics/api/mock/${apiKey}/users`;
}

describe("API key rate limiting", () => {
  it("returns 429 after exceeding the limit", async () => {
    const apiKey = `rate-limit-key-${Date.now()}`;

    for (let i = 0; i < LIMIT; i += 1) {
      const response = await request(app).get(mockRoute(apiKey));
      expect(response.status).not.toBe(429);
    }

    const blocked = await request(app).get(mockRoute(apiKey));

    expect(blocked.status).toBe(429);
    expect(blocked.body).toEqual({
      error: "Rate limit exceeded for this API key.",
    });
  });

  it("tracks limits separately per api key", async () => {
    const saturatedKey = `rate-limit-a-${Date.now()}`;

    for (let i = 0; i <= LIMIT; i += 1) {
      await request(app).get(mockRoute(saturatedKey));
    }

    const blocked = await request(app).get(mockRoute(saturatedKey));

    expect(blocked.status).toBe(429);
  });
});
