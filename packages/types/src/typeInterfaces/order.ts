type betTypeEnum = "buy" | "sell"

interface Order {
    marketId: string,
    betQty: number,
    betType: betTypeEnum,
    selectedOutcome: string
}

export { type Order }