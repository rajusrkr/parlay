export function YSSOCalculations({totalNoQty, totalYesQty, userQty, b}: {totalYesQty: number, totalNoQty: number, userQty: number, b: number}){
    const expYes = Math.exp(totalYesQty / b);
    const expNo = Math.exp(totalNoQty / b);

    // price of yes before the sell order
    const priceBeforeSellOrder = expYes / (expYes + expNo);

    console.log("priceBeforeSellOrder", priceBeforeSellOrder);
    

    // this is the total cost before sell order
    const totalCostBeforeSellOrder = b * Math.log((Math.exp(totalYesQty / b)) + (Math.exp(totalNoQty / b)));
    console.log("totalCostBeforeSellOrder", totalCostBeforeSellOrder);
    

    // minus user qty
    const minusUserQty = totalYesQty - userQty;

    // yes side exp after minusing the userqty
    const newExpYes = Math.exp(minusUserQty / b);
    
    // price after sell order
    const priceAfterSellOrder = newExpYes / (newExpYes + expNo)
    console.log("priceAfterSellOrder", priceAfterSellOrder);

    // total cost after minusing user qty
    const totalCostAfterSellOrder = b * Math.log((Math.exp(minusUserQty / b)) + (Math.exp(totalNoQty / b)))
    console.log("totalCostAfterSellOrder", totalCostAfterSellOrder);
    
 
    // will return cost/payment to user, updated `YES` price and `NO` price.

}