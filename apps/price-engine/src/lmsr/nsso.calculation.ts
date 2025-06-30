import {SellOrderUpdates} from "shared/dist/index"
export function NSSOCalculation({totalYesQty, totalNoQty, userQty, b, requestId}:{totalYesQty: number, totalNoQty: number, userQty: number, b: number, requestId: string}){
    const expYes = Math.exp(totalYesQty / b);
    const expNo = Math.exp(totalNoQty / b);

    // no price before order
    const noPriceBeforeOrder = parseFloat((expNo / (expNo + expYes)).toFixed(2));

    // yes price before order
    
    const yesPriceBeforeOrder = parseFloat((expYes / (expNo + expYes)).toFixed(2))
    
    // total cost before order
    const costBeforeOrder = parseFloat((b * Math.log((expYes) + (expNo))).toFixed(2));
    
    // minus userqty
    const minusUserQty = totalNoQty - userQty;

    // new exp for no
    const newExpNo = Math.exp(minusUserQty / b);

    // new price
    const noPriceAfterOrder = parseFloat((newExpNo / (newExpNo + expYes)).toFixed(2));

    // yes price after order
    const yesPriceAftereOrder = parseFloat((expYes / (newExpNo + expYes)).toFixed(2));
    
    // new cost
    const costAfterOrder = parseFloat((b * Math.log(( newExpNo) + (expYes))).toFixed(2));
 
    // returnToUser to user
    const returnToUser = parseFloat((costBeforeOrder - costAfterOrder).toFixed(2))
    
    const updates: SellOrderUpdates = {
        yesPriceBeforeOrder,
        yesPriceAftereOrder,
        noPriceBeforeOrder,
        noPriceAfterOrder,
        costBeforeOrder,
        costAfterOrder,
        returnToUser,
        requestId
    }

    return updates
}