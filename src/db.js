const mongoose = require('mongoose');

const mongoDBUrl =
    'mongodb+srv://stasinkort1:k1zlWm2679hRzBE3@cluster0.cwbmsah.mongodb.net/yourdbname';

mongoose
    .connect(mongoDBUrl)
    .then(() => console.log('MongoDB подключен...'))
    .catch((err) => console.error('Ошибка подключения к MongoDB:', err));
