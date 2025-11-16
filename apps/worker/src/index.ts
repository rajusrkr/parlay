import Redis from "ioredis";
import { MarketQueue } from "./lib/queue/market";

const redis = new Redis({
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null
});

const marketQueue = new MarketQueue(redis);


marketQueue.open()