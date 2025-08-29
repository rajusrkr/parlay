import { pgTable, unique, serial, varchar, boolean, numeric, timestamp, foreignKey, jsonb, integer, text, bigint, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const accountRole = pgEnum("account_role", ['USER', 'ADMIN'])
export const currencyCode = pgEnum("currency_code", ['INR', 'USD'])
export const currentStatus = pgEnum("current_status", ['not_started', 'open', 'settled', 'cancelled'])
export const marketCategory = pgEnum("market_category", ['sports', 'crypto', 'politics', 'regular'])
export const marketType = pgEnum("market_type", ['binary', 'other'])
export const orderType = pgEnum("order_type", ['buy', 'sell'])


export const user = pgTable("user", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 36 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	userId: varchar("user_id", { length: 36 }).notNull(),
	role: accountRole().default('USER'),
	password: varchar({ length: 120 }).notNull(),
	isVerified: boolean("is_verified").default(true),
	walletBalance: numeric("wallet_balance", { precision: 12, scale:  2 }).default('50000.00'),
	currencyCode: currencyCode().default('USD'),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
}, (table) => [
	unique("user_email_unique").on(table.email),
	unique("user_user_id_unique").on(table.userId),
]);

export const admin = pgTable("admin", {
	id: serial().primaryKey().notNull(),
	adminId: varchar("admin_id", { length: 36 }).notNull(),
	name: varchar({ length: 26 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	password: varchar({ length: 120 }),
	role: accountRole().default('ADMIN'),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	"updatedAt)": timestamp("updated_at)", { mode: 'string' }),
}, (table) => [
	unique("admin_admin_id_unique").on(table.adminId),
	unique("admin_email_unique").on(table.email),
]);

export const position = pgTable("position", {
	id: serial().primaryKey().notNull(),
	positionId: varchar("position_id", { length: 36 }).notNull(),
	positionTakenBy: varchar("position_taken_by", { length: 36 }).notNull(),
	positionTakenIn: varchar("position_taken_in", { length: 36 }).notNull(),
	positionTakenFor: varchar("position_taken_for", { length: 12 }).notNull(),
	"totalQty_&AvgPrice": jsonb("total_qty_&_avg_price").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	isPositionSettles: boolean("is_position_settles").default(false),
}, (table) => [
	foreignKey({
			columns: [table.positionTakenBy],
			foreignColumns: [user.userId],
			name: "position_position_taken_by_user_user_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.positionTakenIn],
			foreignColumns: [market.marketId],
			name: "position_position_taken_in_market_market_id_fk"
		}).onDelete("cascade"),
	unique("position_position_id_unique").on(table.positionId),
]);

export const order = pgTable("order", {
	id: serial().primaryKey().notNull(),
	orderId: varchar("order_id", { length: 36 }).notNull(),
	orderPalcedBy: varchar("order_palced_by", { length: 36 }).notNull(),
	orderTakenId: varchar("order_taken_id", { length: 36 }).notNull(),
	orderPlcedFor: varchar("order_plced_for", { length: 12 }),
	orderType: orderType().notNull(),
	orderQty: integer("order_qty").notNull(),
	updatedPrices: jsonb("updated_prices").notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	averageTradedPrice: numeric("average_traded_price", { precision: 12, scale:  2 }),
}, (table) => [
	foreignKey({
			columns: [table.orderPalcedBy],
			foreignColumns: [user.userId],
			name: "order_order_palced_by_user_user_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.orderTakenId],
			foreignColumns: [market.marketId],
			name: "order_order_taken_id_market_market_id_fk"
		}).onDelete("cascade"),
]);

export const market = pgTable("market", {
	id: serial().primaryKey().notNull(),
	marketId: varchar("market_id", { length: 36 }).notNull(),
	marketCreatedBy: varchar("market_created_by", { length: 36 }).notNull(),
	marketTitle: varchar("market_title", { length: 255 }).notNull(),
	marketOverview: text("market_overview").notNull(),
	marketSettlement: text("market_settlement").notNull(),
	currentStatus: currentStatus("current_status").default('not_started'),
	marketCategory: marketCategory("market_category"),
	marketThumbnailImageUrl: text("market_thumbnail_image_url").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	marketStarts: bigint("market_starts", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	marketEnds: bigint("market_ends", { mode: "number" }).notNull(),
	outcomeAndPrice: jsonb("outcome_and_price").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	winner: jsonb(),
	marketType: marketType("market_type"),
}, (table) => [
	foreignKey({
			columns: [table.marketCreatedBy],
			foreignColumns: [admin.adminId],
			name: "market_market_created_by_admin_admin_id_fk"
		}).onDelete("cascade"),
	unique("market_market_id_unique").on(table.marketId),
]);

export const price = pgTable("price", {
	id: serial().primaryKey().notNull(),
	marketId: varchar("market_id", { length: 36 }).notNull(),
	outcomesAndPrices: jsonb("outcomes_and_prices").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	createdAt: bigint("created_at", { mode: "number" }),
}, (table) => [
	foreignKey({
			columns: [table.marketId],
			foreignColumns: [market.marketId],
			name: "price_market_id_market_market_id_fk"
		}).onDelete("cascade"),
]);

export const pl = pgTable("pl", {
	pl: serial().primaryKey().notNull(),
	marketId: varchar("market_id", { length: 36 }).notNull(),
	userId: varchar("user_id", { length: 36 }).notNull(),
	plOutcome: text("pl_outcome").notNull(),
	netPl: numeric("net_pl", { precision: 12, scale:  2 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.marketId],
			foreignColumns: [market.marketId],
			name: "pl_market_id_market_market_id_fk"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.userId],
			name: "pl_user_id_user_user_id_fk"
		}).onDelete("cascade"),
]);
