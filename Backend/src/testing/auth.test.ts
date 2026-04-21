import request from "supertest";
import { afterAll, beforeAll, it, describe, expect } from "vitest";
import app from "../app";
import { userTable } from "../db/schema";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { registerUser } from "../modules/Auth/auth.service";

let email: string;
let password: string;

beforeAll(async () => {
  email = `test-${Date.now()}@example.com`;
  password = `password`;
  const name = `name-${Date.now()}`;
  await registerUser({ name, email, password });
});

afterAll(async () => {
  await db.delete(userTable).where(eq(userTable.email, email));
});
describe("POST /auth/login", () => {
  it("Returns 200 when logged in", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ email, password });
    const cookies: string[] = Array.isArray(response.headers["set-cookie"])
      ? response.headers["set-cookie"]
      : response.headers["set-cookie"]
        ? [response.headers["set-cookie"]]
        : [];
    expect(response.status).toBe(200);
    expect(cookies.some((c) => c.startsWith("accessToken="))).toBe(true);
    expect(cookies.some((c) => c.startsWith("refreshToken="))).toBe(true);
  });
  it("Returns 401 on wrong password", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ email, password: "wrongpassword" });
    expect(response.status).toBe(401);
  });

  it("Returns 401 on unknown email", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ email: "nobody@example.com", password });
    expect(response.status).toBe(401);
  });

  it("Returns 400 on missing fields", async () => {
    const response = await request(app).post("/auth/login").send({ email });
    expect(response.status).toBe(400);
  });
});
