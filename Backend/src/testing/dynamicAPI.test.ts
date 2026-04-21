import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "../app";
import { db } from "../db";
import { rulesTable, userTable } from "../db/schema";
import { eq } from "drizzle-orm";

let seededUserId: number | null = null;
let seededApiKey = "";
// rule setup
beforeAll(async () => {
  seededApiKey = `test-api-key-${Date.now()}`;
  const email = `test-${Date.now()}@example.com`;

  const insertedUser = await db
    .insert(userTable)
    .values({
      name: "Test User",
      email,
      password: "password",
      api_key: seededApiKey,
      role: "member",
    })
    .returning({ id: userTable.id });

  seededUserId = insertedUser[0]?.id ?? null;

  if (!seededUserId) {
    throw new Error("Failed to seed test user");
  }

  await db.insert(rulesTable).values({
    user_id: seededUserId,
    api_key: seededApiKey,
    endpoint: "/users",
    dataSchema: {
      fullName: "person.fullName",
      email: "internet.email",
    },
    latency: 0,
    version: "v1",
    statusCodes: {
      "200": { weight: 100, message: "OK" },
    },
  });
});

afterAll(async () => {
  if (!seededUserId) {
    return;
  }

  await db.delete(userTable).where(eq(userTable.id, seededUserId));
});

describe("GET /dynamics/api/mock/:apiKey/:endpoint", () => {
  it("returns 404 when no rule matches the api key and endpoint", async () => {
    const apiKey = "key123";
    const endpoint = "users";

    const response = await request(app).get(
      `/dynamics/api/mock/${apiKey}/${endpoint}`,
    );

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });
  it("returns 200 when rule matches the api key and endpoint", async () => {
    const response = await request(app).get(
      `/dynamics/api/mock/${seededApiKey}/users`,
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("statusCode", 200);
    expect(response.body).toHaveProperty("version", "v1");
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveProperty("fullName");
    expect(response.body.data).toHaveProperty("email");
  });
  it("returns 404 when apiKey or endpoint dont match", async () => {
    const response = await request(app).get(
      `/dynamics/api/mock/${seededApiKey + "1"}/urs`,
    );
    expect(response.status).toBe(404);
  });
});
