import { type OutcomeInterface } from "../index"

export type eventTypeEnum = "newBet" | "priceUpdateUI" | "lmsrCalculation" | "authAck"

interface newBetPayload {
    eventType: eventTypeEnum
    betId: string
    data: {
        outcomes: OutcomeInterface[]
        betQty: number
        betType: string,
        selectedOutcomeIndex: number
    }
}

export { newBetPayload }