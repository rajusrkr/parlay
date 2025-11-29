import {
  bigint,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { type Outcome } from "@repo/types/src/index";
import { admin } from "./admin";

export const CategoryEnum = pgEnum("category", ["sports", "crypto"]);
export const MarketStateEnum = pgEnum("market_state", [
  "open",
  "not_started",
  "resolved",
  "resolving",
  "new_order_stoped",
]);

const market = pgTable("market", {
  id: uuid("id").primaryKey().defaultRandom(),
  question: text("question").notNull(),
  settlementRules: text("settlement_rules").notNull(),
  category: CategoryEnum("category").notNull(),
  outcomes: jsonb("outcomes").$type<Outcome[]>().notNull(),
  marketStarts: bigint("market_starts", { mode: "number" }).notNull(),
  marketEnds: bigint("market_ends", { mode: "number" }).notNull(),
  resolution: text("resolution"),
  marketState: MarketStateEnum("market_state").notNull().default("not_started"),
  createdBy: uuid("created_by").references(() => admin.id, {
    onDelete: "cascade",
  }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

const category_sports = pgTable("category_sports", {
  id: uuid("id").primaryKey().defaultRandom(),
  matchId: text("matchId").notNull(),
  matchStarts: bigint("match_starts", { mode: "number" }).notNull(),
  matchEnds: bigint("match_ends", { mode: "number" }).notNull(),
  marketId: uuid("market_id")
    .references(() => market.id, {onDelete: "cascade"})
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

const category_crypto = pgTable("category_crypto", {
  id: uuid("id").primaryKey().defaultRandom(),
  cryptoInterval: text("crypto_interval").notNull(),
  cryptoCoinName: text("crypto_coin_name").notNull(),
  marketId: uuid("market_id")
    .references(() => market.id, {onDelete: "cascade"})
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export { market, category_sports, category_crypto };
