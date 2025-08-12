interface Outcome {
    outcome: string,
    price: string,
    qty: number
}

interface Data {
        // data for price calculation
        oucomes?: Outcome[],
        votedOutcomeIndex?: number,
        qty?: number,
        orderType?: string,

        // message
        message?: string
}


interface WsPayload {
    eventType: string,
    requestId: string,

    data: Data
}

export {WsPayload}