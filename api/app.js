import express from 'express';
import cors from 'cors';
import main from './main.js';

export const app = express();
app.use(express.json());
app.use(cors());

app.get('/api/specs', async (req, res) => { });
app.get('/api/stats', async (req, res) => { });
app.get('/api/configs', async (req, res) => { });
app.get('/api/database', async (req, res) => { });
app.get('/api/file', async (req, res) => { });
app.get('/api/folder', async (req, res) => { });