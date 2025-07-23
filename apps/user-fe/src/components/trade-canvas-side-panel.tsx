import PlaceOrderForm from "./place-order-form";
import ShowAllPositions from "./show-all-positions";

export default function TradeCanvasSidePanel({isBuy, isPosition} : {isBuy: boolean, isPosition: boolean}){
    return(
        <div className="p-4 w-72 h-[100vh] fixed right-20 shadow-md border">
            {
                isBuy && <PlaceOrderForm />
            }

            {
                isPosition && <ShowAllPositions />
            }
        </div>
    )
}