import express from 'express';
import cors from 'cors';

export const app = express();
app.use(express.json());
app.use(cors());

app.get('/api', (req, res) => res.json({ message: "API is up and running!" }));
app.get('/api/:point', async (req, res) => {
    try {
        const { point } = req.params;
        const { param, query } = req.query;
        let data = {};
        if (point === 'specs') {
            data = { message: 'Under dev' }
        } else if (point === 'stats') {
            data = { message: 'Under dev' }
        } else throw new Error("Invalid endpoint");
        res.json({ data });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});

export default app;