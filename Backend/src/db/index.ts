import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import "dotenv/config";

function getDatabaseUrl() {
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction) {
    return process.env.DATABASE_URL_PROD ?? process.env.DATABASE_URL;
  }

  return process.env.DATABASE_URL_DEV ?? process.env.DATABASE_URL;
}

const pool = new Pool({
  connectionString: getDatabaseUrl(),
});

export const db = drizzle(pool, { schema });
