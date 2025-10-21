## Thinking of a new Architecture

With current architecture what I am doing is, I am using ws server as broker between different services if the ws server stops or restart everything will stop and data can be lost and also websocket not meant for backend comunication it meant for backend -> client comunication.

Instead of using the ws server as message broker I should use Redis pub/sub or Redis stream. By doing this I can offload ws server.

## What will be the role of Redis stream?

Once a user send an order I will add that order to the Redis stream from the api server. The flow as follows:

1. user places an order.
2. api server adds that to a specific stream.
3. price engine already has subscription to that stream and can pick the event.
4. price engine calculates that and publishes the calculation to a specific stream.
5. api server now get that calculation and do some db operations.
6. after db operation succeeded, api server create a new stream and a new pub/sub, stream for sending updated price data to client and pub sub for sending the order confirmation.
7. now ws server pick that both stream and pub sub and send them to the client.
