import { WebSocket, WebSocketServer } from "ws";
import Redis from "ioredis";

interface ExtendedWebsocket {
    isAlive: boolean,
    clientRole: string,
    clientId: string
}

const redis = new Redis({
    host: "127.0.0.1",
    port: 6379,
    maxRetriesPerRequest: null
})

const wss = new WebSocketServer({ host: "127.0.0.1", port: 8002 })

/**
 * Create an redis worker
 * whenever something streamed on a channel
 * get that data
 * and run a function that will forward that 
 * data to the client
 */

async function handlePricesStreams() {
    const group = "pricesStream";
    const consumer = "priceUpdates-consumer";
    const stream = "prices:update"

    try {
        await redis.xgroup("CREATE", stream, group, "$", "MKSTREAM")
    } catch (error) {
        console.log(error);
    }

    while (true) {
        const res = await redis.xreadgroup("GROUP", group, consumer, "BLOCK", 5000, "STREAMS", stream, ">") as any;

        if (!res) {
            continue;
        }

        console.log(res);
    }
}

async function handleOrderStatusStreams() {
    const group = "orders-stream";
    const consumer = "order-stream-consumer";
    const stream = "order:status";

    try {
        await redis.xgroup("CREATE", stream, group, "$", "MKSTREAM")
    } catch (error) {
        console.log(error);
    }

    while (true) {
        const res = await redis.xreadgroup("GROUP", group, consumer, "BLOCK", 5000, "STREAMS", stream, ">") as any;

        if (!res) {
            continue;
        }

        console.log(res[0]);

    }
}

handlePricesStreams()

handleOrderStatusStreams()