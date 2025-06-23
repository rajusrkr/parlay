export function YSBOCalculations({totalYesQty, totalNoQty, userQty, b}: {totalYesQty: number, totalNoQty: number, userQty: number, b: number}){
    const expYes = Math.exp(totalYesQty / b);
    const expNo = Math.exp(totalNoQty / b);

    // this is the price of yes share before this order
    const priceBerforeOrder = expYes / ( expYes + expNo );
    console.log("priceBerforeOrder", priceBerforeOrder);
    
    // this is the current market cost/ money in a market
    const totalCostBeforeOrder = b * Math.log((Math.exp(totalYesQty / b)) + (Math.exp(totalNoQty / b))) // 500693.14
    console.log("totalCostBeforeOrder", totalCostBeforeOrder);
    

    // add user qty
    const addUserQty = totalYesQty + userQty;

    // exp for new added user qty
    const newExpYes = Math.exp(addUserQty / b)

    // this is the cost after adding user qty to market
    const totalCostAfterOrder = b * Math.log((Math.exp(addUserQty / b)) + (Math.exp(totalNoQty / b)))
    console.log("totalCostAfterOrder", totalCostAfterOrder);

    // this is the price after the order
    const priceAfterOrder = newExpYes / (newExpYes + expNo);
    console.log("priceAfterOrder",priceAfterOrder);
    
    




    return totalCostBeforeOrder
}