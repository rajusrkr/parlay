import 'dotenv/config';
import {drizzle} from "drizzle-orm/node-postgres"

export const db = drizzle("postgres://postgres:password@localhost:5432/postgres");
