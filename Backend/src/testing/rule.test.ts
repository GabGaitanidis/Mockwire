import { afterAll, beforeAll, describe, expect, it, test } from "vitest";
import { projects, userTable, rulesTable } from "../db/schema";
import { db } from "../db";
import { getRulesByUser } from "../modules/Rules/rules.repo";
import createRuleService from "../modules/Rules/createRule.service";
import { eq } from "drizzle-orm";
let seededUserId: number;
let seededUserId2: number;
let seededProjectId: number;
let seededApiKey;

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
  const insertedUser2 = await db
    .insert(userTable)
    .values({
      name: "Test User2",
      email: email + "a",
      password: "password",
      api_key: seededApiKey + "1",
      role: "member",
    })
    .returning({ id: userTable.id });
  seededUserId = insertedUser[0]?.id ?? null;
  seededUserId2 = insertedUser2[0]?.id ?? null;
  if (!seededUserId) {
    throw new Error("Failed to seed test user");
  }

  const insertedProject = await db
    .insert(projects)
    .values({
      user_id: seededUserId,
      name: `Test Project ${Date.now()}`,
    })
    .returning({ id: projects.id });

  seededProjectId = insertedProject[0]?.id ?? null;

  if (!seededProjectId) {
    throw new Error("Failed to seed test project");
  }

  await db.insert(rulesTable).values({
    user_id: seededUserId,
    project_id: seededProjectId,
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
  if (seededProjectId) {
    await db.delete(projects).where(eq(projects.id, seededProjectId));
  }

  if (!seededUserId) {
    return;
  }

  await db.delete(userTable).where(eq(userTable.id, seededUserId));
});

describe("Rule creation", () => {
  it("Belongs to the correct project", async () => {
    const body = {
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
    };
    const result = await createRuleService(seededUserId, seededProjectId, body);
    expect(result.rule.project_id).toBe(seededProjectId);
  });
  test("User #1 cant access rules from user #2", async () => {
    const body = {
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
    };
    await createRuleService(seededUserId, seededProjectId, body);
    const rules1 = getRulesByUser(seededUserId, seededProjectId);
    const rules2 = getRulesByUser(seededUserId2, seededProjectId);
    expect(rules2 == rules1).toBe(false);
  });
});
