import { app } from "./app";
import { authAndConnectToWsServer } from "./ws/wsAuth&Connection";


const PORT = process.env.PORT || 8000

async function start(){
    authAndConnectToWsServer()
    app.listen(PORT, () => {
    console.log(`Server is up and running on port ${PORT}`);
 })
}

start()

