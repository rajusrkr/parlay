import { calConsume } from "./rConsumer/calc.consumer";
import { marketWorker } from "./bQueue/market.worker";

(async () => {
    const calcs = await calConsume()
    console.log(calcs);
})()

marketWorker()