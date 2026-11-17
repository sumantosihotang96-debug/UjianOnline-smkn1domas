import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

const databaseUrl = process.env.TURSO_DATABASE_URL?.trim();
const authToken = process.env.TURSO_AUTH_TOKEN?.trim();

const client = databaseUrl && authToken ? createClient({ url: databaseUrl, authToken }) : null;

export const db = client ? drizzle(client, { schema }) : null;
export const isDatabaseConfigured = Boolean(client);
