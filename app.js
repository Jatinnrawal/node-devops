require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');

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

app.get('/', (req, res) => {
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

if (require.main === module) {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
