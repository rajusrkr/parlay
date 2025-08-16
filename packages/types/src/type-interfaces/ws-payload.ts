interface Outcome {
    outcome: string,
    price: string,
    tradedQty: number
}

interface Data {
    // data for price calculation
    outcomes?: Outcome[],
    votedOutcomeIndex?: number,
    qty?: number,
    orderType?: string,
    tradeCost?: string,
    returnToUser?: string,

    // auth
    authToken?: string,

    // message
    message?: string
}


interface WsPayload {
    eventType: string,
    requestId?: string,

    data: Data
}

export type { WsPayload }