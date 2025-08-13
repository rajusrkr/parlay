interface Outcome {
    outcome: string,
    price: string,
    qty: number
}

interface Data {
    // data for price calculation
    outcomes?: Outcome[],
    votedOutcomeIndex?: number,
    qty?: number,
    orderType?: string,
    tradeCost?: string,
    returnToUser?: string,
    
    // message
    message?: string
}


interface WsPayload {
    eventType: string,
    requestId: string,

    data: Data
}

export {WsPayload}