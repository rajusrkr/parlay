export function NSSOCalculation({totalYesQty, totalNoQty, userQty, b}:{totalYesQty: number, totalNoQty: number, userQty: number, b: number}){
    const expYes = Math.exp(totalYesQty / b);
    const expNo = Math.exp(totalNoQty / b);
    // price before order
    const priceBeforeOrder = expNo / (expNo + expYes);
    console.log("priceBeforeOrder", priceBeforeOrder);
    
    // total cost before order
    const totalCostBeforeOrder = b * Math.log((Math.exp(totalYesQty / b)) + (Math.exp(totalNoQty / b)));
    console.log("totalCostBeforeOrder", totalCostBeforeOrder);
    
    // minus userqty
    const minusUserQty = totalNoQty - userQty;

    // new exp for no
    const newExpNo = Math.exp(minusUserQty / b);

    // new price
    const priceAfterOrder = newExpNo / (newExpNo + expYes);
    console.log("priceAfterOrder", priceAfterOrder);
    
    // new cost
    const totalCostAfterOrder = b * Math.log((Math.exp(minusUserQty / b)) + (Math.exp(totalYesQty / b)));
    console.log("totalCostAfterOrder", totalCostAfterOrder);
    
}