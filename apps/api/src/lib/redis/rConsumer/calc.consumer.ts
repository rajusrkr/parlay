import { redis } from "../redisClient";

async function calcConsume() {
    const group = "api-server";
    const consumer = "apli-server-cons";
    const stream = "order:calc";

    try {
        await redis.xgroup("CREATE", stream, group, "$", "MKSTREAM")
    } catch (error) {
        console.log(error);
    }

    while (true) {
        const res = await redis.xreadgroup("GROUP", group, consumer, "BLOCK", 5000, "STREAMS", stream, ">");
        if (!res) {
            continue;
        }
        console.log("HANDING OVER TO PROCESS MANAGER");

        processMessage({ data: res })
    }
}


async function processMessage({ data }: { data: any }) {
    const calculations: Record<string, any> = {}

    for (const [_, fields] of data) {
        for (const [_, cals] of fields) {
            console.log(cals);

            for (let i = 0; i < cals.length; i += 2) {
                const key = cals[i]
                const data = cals[i + 1]

                calculations[key] = JSON.parse(data);
            }
        }
    }

    const fullOrder = await redis.hgetall(`order:${calculations.orderCals.orderId}`)
    console.log("FULL ORDER FROM REDIS");

    console.log(JSON.parse(fullOrder.data));

    console.log("CALC");

    console.log(calculations);

    console.log("LOGGED FROM PROCESSOR func");

    /**
     * Perform db operation
     * send an alert to the user about the order => goes to ws server
     * send portfolio update => goes to ws server
     * send update => goes to ws server
     */
}

export { calcConsume }