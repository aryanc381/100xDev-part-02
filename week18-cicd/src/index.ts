import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());

app.listen(3000, () => console.log('APP is live on Port 3000'));

app.get('/health', async (req, res) => {
    return res.json({ status: 200, msg: 'Backend is live and healthy.'});
});

app.get('/feat-1', async(req, res) => {
    return res.json({ status: 200, msg: "This is the future man."});
})