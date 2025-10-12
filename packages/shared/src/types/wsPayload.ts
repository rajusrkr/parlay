import {type OutcomeInterface} from "../index"

interface Data {
    // data for price calculation
    outcomes?: OutcomeInterface[],
    votedOutcomeIndex?: number,
    qty?: number,
    orderType?: string,
    tradeCost?: number,
    returnToUser?: number,

    // auth
    authToken?: string,

    // message
    message?: string
}


interface WsPayload {
    eventType: string,
    requestId?: string,
    marketId?: string,

    data: Data
}

export type { WsPayload }