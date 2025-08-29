import { relations } from "drizzle-orm/relations";
import { user, position, market, order, admin, price, pl } from "./schema";

export const positionRelations = relations(position, ({one}) => ({
	user: one(user, {
		fields: [position.positionTakenBy],
		references: [user.userId]
	}),
	market: one(market, {
		fields: [position.positionTakenIn],
		references: [market.marketId]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	positions: many(position),
	orders: many(order),
	pls: many(pl),
}));

export const marketRelations = relations(market, ({one, many}) => ({
	positions: many(position),
	orders: many(order),
	admin: one(admin, {
		fields: [market.marketCreatedBy],
		references: [admin.adminId]
	}),
	prices: many(price),
	pls: many(pl),
}));

export const orderRelations = relations(order, ({one}) => ({
	user: one(user, {
		fields: [order.orderPalcedBy],
		references: [user.userId]
	}),
	market: one(market, {
		fields: [order.orderTakenId],
		references: [market.marketId]
	}),
}));

export const adminRelations = relations(admin, ({many}) => ({
	markets: many(market),
}));

export const priceRelations = relations(price, ({one}) => ({
	market: one(market, {
		fields: [price.marketId],
		references: [market.marketId]
	}),
}));

export const plRelations = relations(pl, ({one}) => ({
	market: one(market, {
		fields: [pl.marketId],
		references: [market.marketId]
	}),
	user: one(user, {
		fields: [pl.userId],
		references: [user.userId]
	}),
}));