import { Request } from "express";
import { db } from "../db/dbConnection";
import { marketTable } from "../db/schema";
import { and, eq } from "drizzle-orm";
import { sendOrderToWsServer } from "../ws/send-order";
import {v4 as uuidv4} from "uuid"

const pendingRequests = new Map<string, Response>()

const handleOrder = async (req: Request, res: any) => {
    const data = req.body;

    // @ts-ignore
    const userId = req.userId


    // do perform checks here, skiping for now

    try {
        const getMarketDetailsById = await db.select().from((marketTable)).where(and(eq(marketTable.marketId, data.marketId), eq(marketTable.currentStatus, "OPEN")))

        if (getMarketDetailsById.length === 0) {
            return res.status(400).json({success: false, message: "Check market status"})
        }
        

        const requestId = uuidv4()

        pendingRequests.set(requestId, res)


        try {
            const wsReq = await sendOrderToWsServer({
                sentEvent: "new-order",
                data: {
                    requestId,
                    orderSide: data.orderSide,
                    orderType: data.orderType,
                    userOrderQty: data.orderQty,
                    prevYesSideQty: getMarketDetailsById[0].totalYesQty,
                    prevNoSideQty: getMarketDetailsById[0].totalNoQty,
                }
            })

            const response = wsReq;
        } catch (error) {
            console.log(error);
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal server error"})
    }
}

export {handleOrder}