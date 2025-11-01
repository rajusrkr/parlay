import { calcConsume } from "./consumer/calc.consumer";

(async () => {
    const calcs = await calcConsume()
    console.log(calcs);
})()



