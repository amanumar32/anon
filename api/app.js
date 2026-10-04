import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { cache, recache } from '../init.js';
import { _owner, exec_as } from '../commands/owner.js';

export const app = express();
app.use(express.json());
app.use(cors());

app.get('/api', (req, res) => res.json({ message: "API is up and running!" }));

app.get('/api/cache', (req, res) => {
    const { update, key, value, developer } = req.query;
    if (update === 'true' && key && value) {
        if (developer === 'true' && cache.configs.developer[key] !== undefined) cache.configs.developer[key] = JSON.parse(value);
        else if (developer !== 'true' && cache.configs[key] !== undefined) cache.configs[key] = JSON.parse(value);
        recache();
    }
    res.json({ ...cache });
});

app.get('/api/control/:action', async (req, res) => {
    let success = false;
    try {
        const { action } = req.params;
        if (!['start', 'stop', 'restart', 'update'].includes(action)) throw new Error("Invalid control action");
        await recache();
        if (action === 'update') await _owner.update(null, null, null, null, true);
        else await exec_as(`pm2 ${action} anon`);
        res.json({ success: true });
    } catch (error) {
        console.error(error.message);
        res.status(400).json({ error: error.message || 'Internal Server Error' });
    }
});

app.get('/api/system', async (req, res) => {
    try {
        const data = { memory: { total: 0, used: 0 }, cpu: { total: 0, used: 0 }, storage: { total: 0, used: 0 }, bandwidth: { inbound: 0, outbound: 0 } };
        data.memory.total = os.totalmem();
        data.memory.used = data.memory.total - os.freemem();
        res.json({ ...data });
    } catch (error) {
        console.error(error.message);
        res.status(400).json({ error: error.message || 'Internal Server Error' });
    }
});

export default app;