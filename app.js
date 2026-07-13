const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello from Node DevOps!');
});

app.get('/health', (req, res) => {
    res.send('OK');
});

if (require.main === module) {
    app.listen(3000, '0.0.0.0', () => {
        console.log('Server running on port 3000');
    });
}

module.exports = app;
