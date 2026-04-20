import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const databaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.DATABASE_URL_PROD ?? process.env.DATABASE_URL
    : process.env.DATABASE_URL_DEV ?? process.env.DATABASE_URL;

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl!,
  },
});
