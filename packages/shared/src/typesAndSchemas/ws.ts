import { type OutcomeInterface } from "../index"

export type eventTypeEnum = "newBuyBet" | "newSellBet" | "priceUpdateUI" | "lmsrBuyCalculation" | "lmsrSellCalculation" | "authAck" | "handShake"

// Handshake interface
interface handShakeData {
    authToken: string
}

// Auth ack interface
interface authAckData {
    message: string
}

// This will be used for both Buy side and Sell side order
interface newBetData {
    outcomes: OutcomeInterface[]
    betQty: number
    betType: string
    selectedOutcomeIndex: number
    betId: string
}

// Buy side order LMSR calculation ws response interface
interface buyOrderlmsrCalculationInterfaceData {
    outcome: OutcomeInterface[],
    betQty: number,
    betType: string,
    betCost: number,
    betId: string
}

// Sell side order LMSR calculation ws response interface
interface sellOrderlmsrCalculationInterfaceData {
    outcome: OutcomeInterface[],
    betQty: number,
    betType: string,
    pnl: number,
    betId: string
}

// All WS payload will use this
interface wsData {
    eventType: eventTypeEnum
    data: {}
}

export { type wsData, type sellOrderlmsrCalculationInterfaceData, type buyOrderlmsrCalculationInterfaceData, type newBetData, type handShakeData, type authAckData }