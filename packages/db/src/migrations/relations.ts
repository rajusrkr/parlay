import { relations } from "drizzle-orm/relations";
import { admins, markets, users, combineOrder, orders, priceData } from "./schema";

export const marketsRelations = relations(markets, ({one, many}) => ({
	admin: one(admins, {
		fields: [markets.marketCreatedBy],
		references: [admins.adminId]
	}),
	combineOrders: many(combineOrder),
	orders: many(orders),
	priceData: many(priceData),
}));

export const adminsRelations = relations(admins, ({many}) => ({
	markets: many(markets),
}));

export const combineOrderRelations = relations(combineOrder, ({one}) => ({
	user: one(users, {
		fields: [combineOrder.userId],
		references: [users.userId]
	}),
	market: one(markets, {
		fields: [combineOrder.marketId],
		references: [markets.marketId]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	combineOrders: many(combineOrder),
	orders: many(orders),
}));

export const ordersRelations = relations(orders, ({one}) => ({
	market: one(markets, {
		fields: [orders.marketId],
		references: [markets.marketId]
	}),
	user: one(users, {
		fields: [orders.orderPlacedBy],
		references: [users.userId]
	}),
}));

export const priceDataRelations = relations(priceData, ({one}) => ({
	market: one(markets, {
		fields: [priceData.marketId],
		references: [markets.marketId]
	}),
}));