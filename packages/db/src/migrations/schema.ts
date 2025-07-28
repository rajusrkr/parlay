import { pgTable, unique, serial, varchar, boolean, integer, timestamp, foreignKey, bigint, numeric, text, check, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const currencyCode = pgEnum("currency_code", ['INR', 'USD'])
export const currentStatus = pgEnum("current_status", ['NOT_STARTED', 'OPEN', 'SETTLED', 'CANCELLED'])
export const role = pgEnum("role", ['USER', 'ADMIN'])


export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 26 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	password: varchar({ length: 120 }),
	isAccountVerified: boolean("is_account_verified").default(true),
	userId: varchar("user_id", { length: 36 }).notNull(),
	role: role().default('USER'),
	walletBalance: integer("wallet_balance").default(1000),
	currencyCode: currencyCode().default('INR'),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
}, (table) => [
	unique("users_email_unique").on(table.email),
	unique("users_user_id_unique").on(table.userId),
]);

export const admins = pgTable("admins", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 26 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	password: varchar({ length: 120 }),
	isAccountVerified: boolean("is_account_verified").default(true),
	adminId: varchar("admin_id", { length: 36 }).notNull(),
	role: role().default('ADMIN'),
	createdOn: timestamp("created_on", { mode: 'string' }).defaultNow(),
	"updatedOn)": timestamp("updated_on)", { mode: 'string' }),
}, (table) => [
	unique("admins_email_unique").on(table.email),
	unique("admins_admin_id_unique").on(table.adminId),
]);

export const markets = pgTable("markets", {
	id: serial().primaryKey().notNull(),
	marketId: varchar("market_id", { length: 36 }).notNull(),
	marketTitle: varchar("market_title", { length: 120 }).notNull(),
	yesSide: varchar("yes_side", { length: 20 }).notNull(),
	noSide: varchar("no_side", { length: 20 }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	marketStarts: bigint("market_starts", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	marketEnds: bigint("market_ends", { mode: "number" }).notNull(),
	currentStatus: currentStatus().default('NOT_STARTED'),
	winnerSide: varchar("winner_side", { length: 20 }),
	totalYesQty: integer("total_yes_qty").default(500000).notNull(),
	totalNoQty: integer("total_No_qty").default(500000).notNull(),
	lastUpdatedYesPrice: numeric("last_updated_yes_price", { precision: 19, scale:  2 }),
	lastUpdatedNoPrice: numeric("last_updated_no_price", { precision: 19, scale:  2 }),
	marketCreatedBy: varchar("market_created_by", { length: 36 }).notNull(),
	createdOn: timestamp("created_on", { mode: 'string' }).defaultNow(),
	updatedOn: timestamp({ mode: 'string' }),
	marketOverview: text("market_overview"),
	marketSettlement: text("market_settlement"),
}, (table) => [
	foreignKey({
			columns: [table.marketCreatedBy],
			foreignColumns: [admins.adminId],
			name: "markets_market_created_by_admins_admin_id_fk"
		}).onDelete("cascade"),
	unique("markets_market_id_unique").on(table.marketId),
	unique("markets_market_title_unique").on(table.marketTitle),
]);

export const combineOrder = pgTable("combine_order", {
	id: serial().primaryKey().notNull(),
	userId: varchar("user_id", { length: 36 }).notNull(),
	marketId: varchar("market_id", { length: 36 }).notNull(),
	side: varchar({ length: 4 }).notNull(),
	totalQty: integer("total_qty").notNull(),
	avgPrice: numeric("avg_price", { precision: 19, scale:  2 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.userId],
			name: "combine_order_user_id_users_user_id_fk"
		}),
	foreignKey({
			columns: [table.marketId],
			foreignColumns: [markets.marketId],
			name: "combine_order_market_id_markets_market_id_fk"
		}).onDelete("cascade"),
]);

export const orders = pgTable("orders", {
	id: serial().primaryKey().notNull(),
	orderId: varchar("order_id", { length: 36 }).notNull(),
	marketId: varchar("market_id", { length: 36 }),
	price: numeric({ precision: 19, scale:  2 }).notNull(),
	qty: integer().notNull(),
	sideTaken: varchar("side_taken", { length: 3 }).notNull(),
	orderType: varchar("order_type", { length: 36 }),
	orderPlacedBy: varchar("order_placed_by", { length: 36 }).notNull(),
	yesPriceAfterOrder: numeric("yes_price_after_order", { precision: 19, scale:  2 }),
	noPriceAfterOrder: numeric("no_price_after_order", { precision: 19, scale:  2 }),
	createdOn: timestamp("created_on", { mode: 'string' }).defaultNow(),
	updatedOn: timestamp("updated_on", { mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.marketId],
			foreignColumns: [markets.marketId],
			name: "orders_market_id_markets_market_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.orderPlacedBy],
			foreignColumns: [users.userId],
			name: "orders_order_placed_by_users_user_id_fk"
		}).onDelete("cascade"),
]);

export const priceData = pgTable("priceData", {
	id: serial().primaryKey().notNull(),
	marketId: varchar({ length: 36 }),
	yesPrice: numeric("yes_price", { precision: 19, scale:  2 }).notNull(),
	noPrice: numeric("no_price", { precision: 19, scale:  2 }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	priceUpdatedOn: bigint("price_updated_on", { mode: "number" }),
}, (table) => [
	foreignKey({
			columns: [table.marketId],
			foreignColumns: [markets.marketId],
			name: "priceData_marketId_markets_market_id_fk"
		}).onDelete("cascade"),
	check("yes_check", sql`(yes_price >= 0.00) AND (yes_price <= 1.00)`),
	check("no_check", sql`(no_price >= 0.00) AND (no_price <= 1.00)`),
	check("both_side_combined", sql`(yes_price + no_price) <= 1.00`),
]);
