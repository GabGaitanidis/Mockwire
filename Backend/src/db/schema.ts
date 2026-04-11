import {
  integer,
  pgTable,
  timestamp,
  varchar,
  text,
  jsonb,
} from "drizzle-orm/pg-core";

export const userTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  api_key: varchar({ length: 255 }).notNull(),
  refresh_token: varchar({ length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const rulesTable = pgTable("rules", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user_id: integer("user_id")
    .notNull()
    .references(() => userTable.id),
  url_id: integer("url_id").references(() => urlTable.id),
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

export const urlTable = pgTable("urls", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user_id: integer("user_id")
    .notNull()
    .references(() => userTable.id),
  url: varchar({ length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  rules_id: integer()
    .notNull()
    .references(() => rulesTable.id),
});
