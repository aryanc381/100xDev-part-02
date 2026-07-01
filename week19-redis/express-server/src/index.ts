import express from 'express';
import { createClient } from 'redis';

const app = express();
app.use(express.json());

const client = createClient({ url: "redis://localhost:6379" });
client.on('error', (err) => { console.log(`Redis client error ${err}`); }) // this nigga will try to connect to redis://localhost:6739

async function startServer() {
    try {
        await client.connect();
        console.log(`Connected to redis`);

        app.listen(3000, () => { console.log(`App is listening at port 3000`); });
    } catch(err) {
        console.log(`Error connecting to redis: ${err}.`)
    }
}

startServer();