require('dotenv').config();
const AWS = require('aws-sdk');

// Конфигурация AWS SDK
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
const queueUrl = process.env.QUEUE_URL;

module.exports = { sqs, queueUrl };
