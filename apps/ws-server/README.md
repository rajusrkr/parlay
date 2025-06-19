# WS Server (My first websocket real world project)

I have never before worked with web socket in real world project. So, here i will write some notes for ws.

- First we need t initialize an Websocket server with a port.
- the on `connection` listens on specified port for new connection.
- the on `message` event listens for messages from those who are connected to the ws server.
- `ws.send` is for broadcasting data to a specific or all the connected clients.
- the on `error` for handling error
- the on `close` to watch all connected clients, if someone get cutted due to network error or they close connection themeselves.

In this `ws-server` i am making sure that all the clients that are requesting a connection with `ws-server` have a valid role, and pushing event to those clients according to their roles. Like pushing `order-placed` event only to `price-engine`