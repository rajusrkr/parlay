import Redis from "ioredis"
import { type ExtendedWebsocket } from "../../../index4"

class Sub {
    private readonly host = "127.0.0.1"
    private readonly port = 6379
    private redis: Redis

    private readonly priceUpdateChannel = "price:update"
    private readonly portfolioUpdateChannel = "portfolio:update"

    private ws:ExtendedWebsocket


    constructor(ws : ExtendedWebsocket) {
        this.redis = new Redis({
            host: this.host,
            port: this.port
        })
        this.ws = ws
    }

    async subToPriceUpdate() {
        this.redis.subscribe(this.priceUpdateChannel, (err, count) => {
            if (err) {
                console.error(`Failed to subscribr due to some error. Error: ${err}`)
            } else {
                console.log(`Subscribed to ${this.priceUpdateChannel}, sub count ${count} clannels`);

            }
        })
    }

    async subToPortfolioUpdate() {
        this.redis.subscribe(this.portfolioUpdateChannel, (err, count) => {
            if (err) {
                console.error(`Error at subscribing ${this.portfolioUpdateChannel} clannel, ${err}`)
            } else {
                console.log(`Subscribed to ${this.portfolioUpdateChannel}, sub count ${count} clannels`);
            }
        })

        // This is not needed 
        // this.redis.on("message", (channel, portfolioUpdatemessage) => {
        //     console.log(`MESSAGE RECEIVED FROM ${channel}`);
        //     console.log(portfolioUpdatemessage);
        // })
    }

    async listenForMessage() {
        this.redis.on("message", (channel, message) => {
            console.log(`Message received from ${channel}`);


            console.log("sending message");
            
            this.ws.send(message)

            console.log("message sent");
            
        })
    }
}

export { Sub }