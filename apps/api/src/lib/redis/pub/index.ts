import Redis from "ioredis";
import { Outcome } from "@repo/types/dist/src"

interface Message {
    marketId: string,
    calculatedOutcomes: Outcome[]
}


class Producer {
    private readonly host = "127.0.0.1";
    private readonly port = 6379
    private redis: Redis;
    message: Message;
    private readonly priceUpdateChannel = "priceUpdateChannel"

    constructor(message: Message) {
        this.redis = new Redis({
            host: this.host,
            port: this.port
        })
        this.message = message
    }


    async publishUpdatedPrices() {
        await this.redis.publish(this.priceUpdateChannel, JSON.stringify(this.message))
    }
}

export { Producer }