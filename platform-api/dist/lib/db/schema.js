"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersSessions = exports.user = exports.CurrencyCode = exports.UserRole = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.UserRole = (0, pg_core_1.pgEnum)("user_role", ["USER", "ADMIN"]);
exports.CurrencyCode = (0, pg_core_1.pgEnum)("currency_code", ["INR", "USD"]);
// USER TABLE
exports.user = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    name: (0, pg_core_1.varchar)("name", { length: 36 }).notNull(),
    userId: (0, pg_core_1.varchar)("user_id", { length: 36 }).notNull().unique(),
    userEmail: (0, pg_core_1.varchar)("user_email", { length: 255 }).notNull().unique(),
    password: (0, pg_core_1.varchar)("password", { length: 16 }).notNull(),
    role: (0, exports.UserRole)().default("USER"),
    userAccountBalance: (0, pg_core_1.decimal)("user_balance", { precision: 19, scale: 4 }).default("1000.00"),
    currency: (0, exports.CurrencyCode)().default("INR"),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").$onUpdate(() => new Date())
});
// USER SESSION MANAGE TABLE
exports.usersSessions = (0, pg_core_1.pgTable)("usersSessions", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    sessionId: (0, pg_core_1.varchar)("session_id", { length: 36 }),
    sessionFor: (0, pg_core_1.integer)("session_for").references(() => exports.user.id, { onDelete: "cascade" }),
    isSessionActive: (0, pg_core_1.boolean)("is_session_active").default(false),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").$onUpdate(() => new Date())
});
