import { WebSocketServer } from 'ws';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
const httpServer = app.listen(8000)

const wss = new WebSocketServer({ server: httpServer });

app.get('/', (req, res) => {
    return res.json({
        msg: 'App is live!'
    });
});

wss.on('connection', (socket) => {
    socket.on('error', console.error);
    socket.on('message', (data, isBinary) => {
        wss.clients.forEach(function each(client) {
            if(client.readyState === WebSocket.OPEN) {
                client.send(data, { binary: isBinary });
            }
        });
    });
    socket.send('Hello! Message from Server!!!');
});

console.log("SERVER IS LISTENING AT PORT 8000");