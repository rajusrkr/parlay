import "dotenv/config";

import {drizzle} from "drizzle-orm/node-postgres"

const db = drizzle("postgres://postgres:password@localhost:5432/postgres")

export {db}