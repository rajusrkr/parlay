interface BuyOrderUpdates {
    yesPriceBeforeOrder: number,
    noPriceBeforeOrder: number,
    yesPriceAftereOrder: number,
    noPriceAfterOrder: number,
    costBeforeOrder: number,
    costAfterOrder: number,
    costToUser: number
}

interface SellOrderUpdates {
    yesPriceBeforeOrder: number,
    noPriceBeforeOrder: number,
    yesPriceAftereOrder: number,
    noPriceAfterOrder: number,
    costBeforeOrder: number,
    costAfterOrder: number,
    costToUser: number
}

export { BuyOrderUpdates, SellOrderUpdates }