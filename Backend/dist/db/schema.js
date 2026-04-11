"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlTable = exports.rulesTable = exports.userTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.userTable = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.integer)().primaryKey().generatedAlwaysAsIdentity(),
    name: (0, pg_core_1.varchar)({ length: 255 }).notNull(),
    email: (0, pg_core_1.varchar)({ length: 255 }).notNull().unique(),
    password: (0, pg_core_1.varchar)({ length: 255 }).notNull(),
    api_key: (0, pg_core_1.varchar)({ length: 255 }).notNull(),
    refresh_token: (0, pg_core_1.varchar)({ length: 255 }),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.rulesTable = (0, pg_core_1.pgTable)("rules", {
    id: (0, pg_core_1.integer)().primaryKey().generatedAlwaysAsIdentity(),
    user_id: (0, pg_core_1.integer)("user_id")
        .notNull()
        .references(() => exports.userTable.id),
    url_id: (0, pg_core_1.integer)("url_id").references(() => exports.urlTable.id),
    endpoint: (0, pg_core_1.varchar)({ length: 255 }).notNull(),
    dataSchema: (0, pg_core_1.jsonb)("data_schema").$type().notNull(),
    latency: (0, pg_core_1.integer)().default(0).notNull(),
    errorRate: (0, pg_core_1.integer)().default(0).notNull(),
    statusCodes: (0, pg_core_1.jsonb)("status_codes")
        .$type()
        .notNull()
        .default({ "200": { weight: 100, message: "OK" } }),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    api_key: (0, pg_core_1.varchar)({ length: 255 }).notNull(),
});
exports.urlTable = (0, pg_core_1.pgTable)("urls", {
    id: (0, pg_core_1.integer)().primaryKey().generatedAlwaysAsIdentity(),
    user_id: (0, pg_core_1.integer)("user_id")
        .notNull()
        .references(() => exports.userTable.id),
    url: (0, pg_core_1.varchar)({ length: 255 }).notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    rules_id: (0, pg_core_1.integer)()
        .notNull()
        .references(() => exports.rulesTable.id),
});
