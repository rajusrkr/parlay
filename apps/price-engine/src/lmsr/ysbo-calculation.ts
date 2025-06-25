import {BuyOrderUpdates} from "shared/dist/index"

export function YSBOCalculations({totalYesQty, totalNoQty, userQty, b}: {totalYesQty: number, totalNoQty: number, userQty: number, b: number}){
    const expYes = Math.exp(totalYesQty / b);
    const expNo = Math.exp(totalNoQty / b);

    // yes price of yes share before this order
    const yesPriceBeforeOrder = parseFloat((expYes / ( expYes + expNo )).toFixed(2));

    // no price before order
    const noPriceBeforeOrder = parseFloat((expNo / (expNo + expYes)).toFixed(2))
    
    // this is the current market cost/ money in a market
    const costBeforeOrder = parseFloat((b * Math.log((Math.exp(totalYesQty / b)) + (Math.exp(totalNoQty / b)))).toFixed(2))

    // add user qty
    const addUserQty = totalYesQty + userQty;

    // exp for new added user qty
    const newExpYes = Math.exp(addUserQty / b)

    // this is the cost after adding user qty to market
    const costAfterOrder = parseFloat((b * Math.log((Math.exp(addUserQty / b)) + (Math.exp(totalNoQty / b)))).toFixed(2))

    // cost to user
    const costToUser = parseFloat((costAfterOrder - costBeforeOrder).toFixed(2))

    // this is the price after the order
    const yesPriceAftereOrder = parseFloat((newExpYes / (newExpYes + expNo)).toFixed(2));

    // no price after order
    const noPriceAfterOrder = parseFloat((expNo / (newExpYes + expNo)).toFixed(2))

    const updates: BuyOrderUpdates = {
        yesPriceBeforeOrder,
        yesPriceAftereOrder,
        noPriceBeforeOrder,
        noPriceAfterOrder,
        costBeforeOrder,
        costAfterOrder,
        costToUser
    }

    return updates
}