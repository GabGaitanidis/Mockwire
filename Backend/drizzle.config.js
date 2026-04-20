"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const drizzle_kit_1 = require("drizzle-kit");
const databaseUrl = process.env.NODE_ENV === "production"
    ? process.env.DATABASE_URL_PROD ?? process.env.DATABASE_URL
    : process.env.DATABASE_URL_DEV ?? process.env.DATABASE_URL;
exports.default = (0, drizzle_kit_1.defineConfig)({
    out: "./drizzle",
    schema: "./src/db/schema.ts",
    dialect: "postgresql",
    dbCredentials: {
        url: databaseUrl,
    },
});
