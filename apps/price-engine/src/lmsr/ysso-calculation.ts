import {SellOrderUpdates} from "shared/dist/index"

export function YSSOCalculations({totalNoQty, totalYesQty, userQty, b}: {totalYesQty: number, totalNoQty: number, userQty: number, b: number}){
    const expYes = Math.exp(totalYesQty / b);
    const expNo = Math.exp(totalNoQty / b);

    // price of yes before the sell order
    const yesPriceBeforeOrder = parseFloat((expYes / (expYes + expNo)).toFixed(2));

    // no price before order
    const noPriceBeforeOrder = parseFloat((expNo / (expYes + expNo)).toFixed(2))

    

    // this is the total cost before sell order
    const costBeforeOrder = parseFloat((b * Math.log((expYes) + (expNo))).toFixed(2));

    // minus user qty
    const minusUserQty = totalYesQty - userQty;

    // yes side exp after minusing the userqty
    const newExpYes = Math.exp(minusUserQty / b);
    
    // yes price after sell order
    const yesPriceAftereOrder = parseFloat((newExpYes / (newExpYes + expNo)).toFixed(2))

    // no price after sell order
    const noPriceAfterOrder = parseFloat((expNo / (newExpYes + expNo )).toFixed(2))

    // total cost after minusing user qty
    const costAfterOrder = parseFloat((b * Math.log((newExpYes) + (expNo))).toFixed(2))
    
    // return to user
    const returnToUser = parseFloat((costAfterOrder - costBeforeOrder).toFixed(2))
 
    const update: SellOrderUpdates = {
        yesPriceBeforeOrder,
        yesPriceAftereOrder,
        noPriceBeforeOrder,
        noPriceAfterOrder,
        costBeforeOrder,
        costAfterOrder,
        returnToUser
    }

    return update

}