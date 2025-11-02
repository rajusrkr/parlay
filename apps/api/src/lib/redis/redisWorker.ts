import { calcConsume } from "./rConsumer/calc.consumer";

(async () => {
    const calcs = await calcConsume()
    console.log(calcs);
})()



