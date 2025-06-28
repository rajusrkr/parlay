interface BuyOrderUpdates {
    yesPriceBeforeOrder: number,
    noPriceBeforeOrder: number,
    yesPriceAftereOrder: number,
    noPriceAfterOrder: number,
    costBeforeOrder: number,
    costAfterOrder: number,
    costToUser: number,
    requestId: string
}

interface SellOrderUpdates {
    yesPriceBeforeOrder: number,
    noPriceBeforeOrder: number,
    yesPriceAftereOrder: number,
    noPriceAfterOrder: number,
    costBeforeOrder: number,
    costAfterOrder: number,
    returnToUser: number,
    requestId: string
}

export { BuyOrderUpdates, SellOrderUpdates }