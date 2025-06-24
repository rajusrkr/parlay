import { NSBOCalculation } from "../lmsr/nsbo-calculation";
import { NSSOCalculation } from "../lmsr/nsso.calculation";
import { YSBOCalculations } from "../lmsr/ysbo-calculation";
import { YSSOCalculations } from "../lmsr/ysso-calculation";
import { ws } from "../ws-client";
import {wsSend} from "shared/dist/index"

export function handleWsMessage(): Promise<any>{
    return new Promise((resolve, reject) => {
        ws.on("message", (msg) => {
            const receivedData = JSON.parse(msg.toString())
            
            // for auth message
             if (receivedData.wsMessageData.messageEvent === "auth-success") {
                console.log(`Connection established with ws-server`);
                console.log(receivedData.wsMessageData);
            }
            // for new order received
            if (receivedData.wsMessageData.messageEvent === "new-order") {

                const data = receivedData.wsMessageData.data

                if (data.orderSide === "yes" && data.orderType === "buy") {
                    // place here the yes side buy order func
                    const priceUpdate = YSBOCalculations({totalYesQty: data.prevYesSideQty, totalNoQty: data.prevNoSideQty, b: 1000, userQty: data.userOrderQty})

                    console.log({orderType: 'YSBO'});
                    console.log(priceUpdate);
                    
                    const wsData: wsSend = {sentEvent: "price-update", data: {priceUpdate}} 
                
                    ws.send(JSON.stringify({wsData}))
                }

                if (data.orderSide === "yes" && data.orderType === "sell") {
                    // place the yes side sell func
                    const priceUpdate = YSSOCalculations({totalYesQty: data.prevYesSideQty, totalNoQty: data.prevNoSideQty, b: 1000, userQty: data.userOrderQty})

                    console.log({orderType: 'YSSO'});
                    console.log(priceUpdate);
                    
                    const wsData: wsSend = {sentEvent: "price-update", data: {priceUpdate}} 
                
                    ws.send(JSON.stringify({wsData}))
                }

                if (data.orderSide === "no" && data.orderType === "buy") {
                    // place the no side sell func

                    const priceUpdate = NSBOCalculation({totalYesQty: data.prevYesSideQty, totalNoQty: data.prevNoSideQty, b: 1000, userQty: data.userOrderQty})

                    console.log({orderType: 'NSBO'});
                    

                    console.log(priceUpdate);
                    
                    const wsData: wsSend = {sentEvent: "price-update", data: {priceUpdate}} 
                
                    ws.send(JSON.stringify({wsData}))
                }

                if (data.orderSide === "no" && data.orderType === "sell") {
                    // place no side sell func

                    const priceUpdate = NSSOCalculation({totalYesQty: data.prevYesSideQty, totalNoQty: data.prevNoSideQty, b: 1000, userQty: data.userOrderQty})
                    console.log({orderType: 'NSSO'});
                    console.log(priceUpdate);
                    
                    const wsData: wsSend = {sentEvent: "price-update", data: {priceUpdate}} 
                
                    ws.send(JSON.stringify({wsData}))
                }
            }
            
            resolve(receivedData)
        })

    })
}