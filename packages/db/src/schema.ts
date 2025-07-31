import { sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  check,
  decimal,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const AccountRoleEnum = pgEnum("role", ["USER", "ADMIN"]);
export const CurrencyCode = pgEnum("currency_code", ["INR", "USD"]);
export const CurrentMarketStatus = pgEnum("current_status", ["NOT_STARTED","OPEN","SETTLED","CANCELLED"]);
export const MarketCategory = pgEnum("market_category", ["SPORTS", "CRYPTO", "POLITICS"])

// This table contains user details and wallet balance
export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 26 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 120 }),
  isAccountVerified: boolean("is_account_verified").default(true),
  userId: varchar("user_id", { length: 36 }).notNull().unique(),
  role: AccountRoleEnum().default("USER"),
  walletBalance: integer("wallet_balance").default(1000),
  currencyCode: CurrencyCode().default("INR"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});


// This table contains all information about a market
export const marketTable = pgTable("markets", {
  id: serial("id").primaryKey(),
  marketId: varchar("market_id", { length: 36 }).notNull().unique(),
  marketTitle: varchar("market_title", { length: 120 }).notNull().unique(),
  marketOverview: text("market_overview"),
  marketSettlement: text("market_settlement"),
  yesSide: varchar("yes_side", { length: 20 }).notNull(),
  noSide: varchar("no_side", { length: 20 }).notNull(),
  marketStarts: bigint("market_starts", { mode: "number" }).notNull(),
  marketEnds: bigint("market_ends", { mode: "number" }).notNull(),
  currentStatus: CurrentMarketStatus().default("NOT_STARTED"),
  marketCategory: MarketCategory(),
  winnerSide: varchar("winner_side", { length: 20 }),
  totalYesQty: integer("total_yes_qty").notNull().default(500000),
  totalNoQty: integer("total_No_qty").notNull().default(500000),
  lastUpdatedYesPrice: decimal("last_updated_yes_price", {
    precision: 19,
    scale: 2,
  }),
  lastUpdatedNoPrice: decimal("last_updated_no_price", {
    precision: 19,
    scale: 2,
  }),
  marketCreatedBy: varchar("market_created_by", { length: 36 })
    .references(() => adminsTable.adminId, { onDelete: "cascade" })
    .notNull(),
  createdOn: timestamp("created_on").defaultNow(),
  updatedOn: timestamp().$onUpdate(() => new Date()),
});
// This table is to record price changes
export const priceData = pgTable(
  "priceData",
  {
    id: serial("id").primaryKey(),
    marketId: varchar("marketId", { length: 36 }).references(
      () => marketTable.marketId,
      { onDelete: "cascade" }
    ),
    yesSidePrice: decimal("yes_price", { precision: 19, scale: 2 }).notNull(),
    noSidePrice: decimal("no_price", { precision: 19, scale: 2 }).notNull(),
    priceUpdatedOn: bigint("price_updated_on", { mode: "number" }),
  },
  (table) => ({
    yesPriceCheck: check(
      "yes_check",
      sql`${table.yesSidePrice} >=0.00 AND ${table.yesSidePrice} <=1.00`
    ),
    noPriceCheck: check(
      "no_check",
      sql`${table.noSidePrice} >=0.00 AND ${table.noSidePrice} <=1.00`
    ),
    bothSidePriceCombined: check(
      "both_side_combined",
      sql`${table.yesSidePrice} + ${table.noSidePrice} <=1.00`
    ),
  })
);

// This table is to recprd orders
export const orderTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderId: varchar("order_id", { length: 36 }).notNull(),
  marketId: varchar("market_id", { length: 36 }).references(
    () => marketTable.marketId,
    { onDelete: "cascade" }
  ),
  executionPrice: decimal("price", { precision: 19, scale: 2 }).notNull(),
  qty: integer("qty").notNull(),
  sideTaken: varchar("side_taken", { length: 3 }).notNull(),
  orderType: varchar("order_type", { length: 36 }),
  orderPlacedBy: varchar("order_placed_by", { length: 36 })
    .notNull()
    .references(() => usersTable.userId, { onDelete: "cascade" }),
  yesPriceAfterOrder: decimal("yes_price_after_order", {
    precision: 19,
    scale: 2,
  }),
  noPriceAfterOrder: decimal("no_price_after_order", {
    precision: 19,
    scale: 2,
  }),
  createdOn: timestamp("created_on").defaultNow(),
  updatedOn: timestamp("updated_on").$onUpdate(() => new Date()),
});

// This is admin table
export const adminsTable = pgTable("admins", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 26 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 120 }),
  isAccountVerified: boolean("is_account_verified").default(true),
  adminId: varchar("admin_id", { length: 36 }).notNull().unique(),
  role: AccountRoleEnum().default("ADMIN"),
  createdOn: timestamp("created_on").defaultNow(),
  updatedOn: timestamp("updated_on)").$onUpdate(() => new Date()),
});

// This table I will use to cobine sameside order for a user
export const combinedOrders = pgTable("combine_order", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 36 })
    .references(() => usersTable.userId)
    .notNull(),
  marketId: varchar("market_id", { length: 36 })
    .references(() => marketTable.marketId, { onDelete: "cascade" })
    .notNull(),
  side: varchar("side", { length: 4 }).notNull(),
  totalQty: integer("total_qty").notNull(),
  avgPrice: decimal("avg_price", { precision: 19, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});
