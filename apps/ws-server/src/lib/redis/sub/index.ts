import Redis from "ioredis";
import { WebSocket } from "ws";

interface ExtendedWebsocket extends WebSocket {
  isAlive: boolean;
}

type ConnectedClients = Map<ExtendedWebsocket, string>;

class Sub {
  private readonly host = "127.0.0.1";
  private readonly port = 6379;
  private redis: Redis;

  private readonly priceUpdateChannel = "price:update";
  private readonly portfolioUpdateChannel = "portfolio:update";

  constructor() {
    this.redis = new Redis({
      host: this.host,
      port: this.port,
    });
  }

  async subToPriceUpdate() {
    await this.redis.subscribe(this.priceUpdateChannel, (err, count) => {
      if (err) {
        console.error(`Failed to subscribr due to some error. Error: ${err}`);
      } else {
        console.log(
          `Subscribed to ${this.priceUpdateChannel}, sub count ${count} clannels`
        );
      }
    });
  }

  async subToPortfolioUpdate() {
    await this.redis.subscribe(this.portfolioUpdateChannel, (err, count) => {
      if (err) {
        console.error(
          `Error at subscribing ${this.portfolioUpdateChannel} clannel, ${err}`
        );
      } else {
        console.log(
          `Subscribed to ${this.portfolioUpdateChannel}, sub count ${count} clannels`
        );
      }
    });
  }

  listenForMessage(connectedClients: ConnectedClients) {
    this.redis.on("message", (channel, message) => {
      if (channel === this.priceUpdateChannel) {
        for (const [user, _] of connectedClients.entries()) {
          user.send(message);
        }
      } else if (channel === this.portfolioUpdateChannel) {
        const messageData = JSON.parse(message);
        for (const [user, userId] of connectedClients.entries()) {
          if (userId === messageData.userId) {
            user.send(message);
          }
        }
      } else {
        throw new Error("Unknown channel");
      }
    });
  }
}

export { Sub };
