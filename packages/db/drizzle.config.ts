import 'dotenv/config'
import {defineConfig} from "drizzle-kit"

export default defineConfig({
    out: "./src/migrations",
    schema: "./src/db-schema",
    dialect: "postgresql",
    dbCredentials: {
        url: "postgres://postgres:password@localhost:5432/postgres"
    }
})