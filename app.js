require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const client = require('prom-client');

const app = express();
const PORT = process.env.PORT || 3000;
const MESSAGE = process.env.APP_MESSAGE || 'Hello from Node DevOps demo!';

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'example',
    database: process.env.DB_NAME || 'devopsdb',
    port: 5432,
});

// Collect default Node.js metrics (CPU, memory, event loop, etc.)
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

// Custom metric: count total requests to '/'
const requestCounter = new client.Counter({
    name: 'homepage_requests_total',
    help: 'Total number of requests to the homepage'
});

app.get('/', (req, res) => {
    requestCounter.inc();
    res.send(MESSAGE);
});

app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

app.get('/db-check', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ db: 'connected', time: result.rows[0].now });
    } catch (err) {
        res.status(500).json({ db: 'error', message: err.message });
    }
});

app.get('/metrics', async (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
});

if (require.main === module) {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
