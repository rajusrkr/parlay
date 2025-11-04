import { type OutcomeInterface } from "../typesAndSchemas/market";

interface OrderProducer {
    betQty: number,
    betType: "buy" | "sell",
    orderId: string,
    outcomes: OutcomeInterface[],
    selectedOutcomeIndex: number
}

interface OrderStore {
    betQty: number,
    betType: "buy" | "sell",
    marketId: string,
    orderId: string,
    outcomes: OutcomeInterface[],
    selectedOutcome: string,
    selectedOutcomeIndex: number,
    userId: string
}

interface OrderCalc {
    calculatedOutcome: OutcomeInterface[],
    tradeCost?: number,
    returnToUser?: number,
    orderId: string
}

export { type OrderProducer, type OrderStore, type OrderCalc }