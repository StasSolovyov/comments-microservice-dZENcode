const AWS = require('aws-sdk');

// Непосредственное указание параметров конфигурации
AWS.config.update({
    accessKeyId: 'AKIA47CRVT2Q356TN7U7',
    secretAccessKey: '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',
    region: 'us-east-1',
});

const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
const queueUrl = 'https://sqs.us-east-1.amazonaws.com/891377000097/Stas';

module.exports = { sqs, queueUrl };
