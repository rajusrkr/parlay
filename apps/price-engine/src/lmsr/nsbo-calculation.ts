import {BuyOrderUpdates} from "shared/dist/index"
export function NSBOCalculation({totalYesQty, totalNoQty, userQty, b, requestId} : {totalYesQty: number, totalNoQty: number, userQty: number, b: number, requestId: string}){
    const expYes = Math.exp(totalYesQty / b);
    const expNo = Math.exp(totalNoQty / b);

    // no price before order
    const noPriceBeforeOrder = parseFloat((expNo / (expNo + expYes)).toFixed(2));

    // yes price before order
    const yesPriceBeforeOrder = parseFloat((expYes / (expYes + expNo)).toFixed(2));

    // total cost before order
    const costBeforeOrder = parseFloat((b * Math.log((expYes) + (expNo))).toFixed(2));
    
    // adding user qty
    const addUserQty = totalNoQty + userQty;

    // new expNo
    const newExpNo = Math.exp(addUserQty / b);

    // no price after order
    const noPriceAfterOrder = parseFloat((newExpNo / (newExpNo + expYes)).toFixed(2));

    // yes price after order
    const yesPriceAftereOrder = parseFloat((expYes / (newExpNo + expYes)).toFixed(2));

    // cost after order
    const costAfterOrder = parseFloat((b * Math.log((expYes) + (newExpNo))).toFixed(2));

    // cost to user
    const costToUser = parseFloat((costAfterOrder - costBeforeOrder).toFixed(2));

    const updates: BuyOrderUpdates = {
        yesPriceBeforeOrder,
        yesPriceAftereOrder,
        noPriceBeforeOrder,
        noPriceAfterOrder,
        costBeforeOrder: Math.round(costBeforeOrder),
        costAfterOrder: Math.round(costAfterOrder),
        costToUser: Math.round(costToUser),
        requestId
    }

    return updates
}
