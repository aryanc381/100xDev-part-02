import express from 'express';
import { createClient } from 'redis';

const app = express();
app.use(express.json());

const client = createClient({ url: "redis://localhost:6379" });
client.on('error', (err) => { console.log(`Redis client error ${err}`); }) // this nigga will try to connect to redis://localhost:6739

app.post('/submit', async(req, res) => {
    const { problemId, userId, code, language } = req.body;
    try {
        await client.lPush("problems", JSON.stringify({ problemId, userId, code, language }));
        res.json({ status: 200, msg: "Submission received." });
    } catch(err) {
        res.json({ status: 500, msg: "My bad, not yours." })
    }
    
});

async function startServer() {
    try {
        await client.connect();
        console.log(`Connected to redis`);

        app.listen(3010, () => { console.log(`App is listening at port 3010`); });
    } catch(err) {
        console.log(`Error connecting to redis: ${err}.`)
    }
}

startServer();