import WebSocket from "ws";
import jwt from "jsonwebtoken";
let ws: WebSocket;
import { wsData } from "shared/dist/index";

export function connectToWsServer() {
  return new Promise<void>((resolve, reject) => {
    // generating the token with role
    const token = jwt.sign(
      { clientRole: "price-engine" },
      `${process.env.JWT_SECRET}`
    );
    // url to connect
    ws = new WebSocket("ws://localhost:8001");
    const wsData: wsData = { event: "handShake", data: { token } };

    // on connection open send token
    ws.on("open", () => {
      ws.send(JSON.stringify({ wsData }));

      console.log(`[WS] connected as price-engine`);

      resolve();
    });
    // on receiving message from ws-server
    ws.on("message", (msg) => {
      const data = JSON.parse(msg.toString());

      
      if (data.event === "order-placed") {
        const totalPool = data.orderDetails.yesSide + data.orderDetails.noSide;


        console.log("TOTAL YES AND NO QTY COMBINED");
        console.log(totalPool); //logs 24310

        console.log("YES SIDE PRICE");

        console.log(Math.round((data.orderDetails.yesSide / totalPool) * 100)); //logs 100

        console.log("NO SIDE PRICE");

        console.log(Math.round((data.orderDetails.noSide / totalPool) * 100));
      }
    });
    //  on error
    ws.on("error", reject);
  });
}
