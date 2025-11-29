import { pgTable, serial, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { AccountRole } from "./user"

const admin = pgTable("admin", {
    // Admin indentity
    id: uuid("id").primaryKey().defaultRandom(),

    // Admin details
    name: varchar("name", { length: 26 }).notNull(),
    email: varchar("email", { length: 255 }).unique().notNull(),


    // Password and role
    password: varchar("password", { length: 120 }),
    role: AccountRole().default("ADMIN"),


    // Timestamp
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at)").$onUpdate(() => new Date()),
})


export { admin }