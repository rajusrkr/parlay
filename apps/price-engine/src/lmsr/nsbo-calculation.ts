export function NSBOCalculation({totalYesQty, totalNoQty, userQty, b} : {totalYesQty: number, totalNoQty: number, userQty: number, b: number}){
    const expYes = Math.exp(totalYesQty / b);
    const expNo = Math.exp(totalNoQty / b);

    // price before order
    const priceBeforeOrder = expNo / (expNo + expYes);
    console.log("priceBeforeOrder", priceBeforeOrder);


    // total cost before order
    const totalCostBeforeOrder = b * Math.log((Math.exp(totalYesQty / b)) + (Math.exp(totalNoQty / b)));
    console.log("totalCostBeforeOrder", totalCostBeforeOrder);
    
    // adding user qty
    const addUserQty = totalNoQty + userQty;

    // new expNo
    const newExpNo = Math.exp(addUserQty / b);

    // price after order
    const priceAfterOrder = newExpNo / (newExpNo + expYes);
    console.log("priceAfterOrder", priceAfterOrder);

    // cost after order
    const totalCostAfterOrder = b * Math.log((Math.exp(totalYesQty / b)) + (Math.exp(addUserQty / b)));
    console.log("totalCostAfterOrder", totalCostAfterOrder);
    
}