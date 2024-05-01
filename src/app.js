require('dotenv').config();
const express = require('express');
const { pollQueue } = require('./services/queueService');
const mongoose = require('./db'); // Предполагается, что db.js экспортирует настройки mongoose

const app = express();
app.use(express.json());

app.get('/', (req, res) => res.send('Comments Microservice is running...'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    pollQueue(); // Запуск поллинга очереди
});
