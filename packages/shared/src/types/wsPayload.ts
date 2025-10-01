interface Outcome {
    outcome: string,
    price: string | number,
    tradedQty: number
}

interface Data {
    // data for price calculation
    outcomes?: Outcome[],
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