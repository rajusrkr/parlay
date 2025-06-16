import { app } from "./app";
import { connectToWsServer } from "./ws-client";

const PORT = process.env.PORT || 8000

async function start(){
    await connectToWsServer()
    app.listen(PORT, () => {
    console.log(`Server is up and running on port ${PORT}`);
 })
}

start()

