import {
  integer,
  pgTable,
  timestamp,
  varchar,
  jsonb,
} from "drizzle-orm/pg-core";

export const userTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  api_key: varchar({ length: 255 }).notNull(),
  role: varchar({ length: 255 }).notNull().default("member"),
  refresh_token: varchar({ length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const projects = pgTable("projects", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user_id: integer("user_id"),
  name: varchar({ length: 255 }).notNull().default("Project"),
});

export const rulesTable = pgTable("rules", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user_id: integer("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  url_id: integer("url_id"),
  project_id: integer("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  version: varchar({ length: 255 }).notNull().default("v1"),
  endpoint: varchar({ length: 255 }).notNull(),
  dataSchema: jsonb("data_schema").$type<Record<string, string>>().notNull(),
  latency: integer().default(0).notNull(),
  errorRate: integer().default(0).notNull(),
  statusCodes: jsonb("status_codes")
    .$type<Record<string, { weight: number; message: string }>>()
    .notNull()
    .default({ "200": { weight: 100, message: "OK" } }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  api_key: varchar({ length: 255 }).notNull(),
});

export const conditionSetsTable = pgTable("condition_sets", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user_id: integer("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  project_id: integer("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  name: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 255 }),
  conditions: jsonb("conditions")
    .$type<Array<Record<string, unknown>>>()
    .notNull()
    .default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const ruleConditionSetsTable = pgTable("rule_condition_sets", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  rule_id: integer("rule_id")
    .notNull()
    .references(() => rulesTable.id, { onDelete: "cascade" }),
  condition_set_id: integer("condition_set_id")
    .notNull()
    .references(() => conditionSetsTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const urlTable = pgTable("urls", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user_id: integer("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  project_id: integer("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  url: varchar({ length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  rules_id: integer()
    .notNull()
    .references(() => rulesTable.id, { onDelete: "cascade" }),
});
