const { sqs, queueUrl } = require('../config/awsConfig');
const mongoose = require('mongoose');
const Comment = require('../models/Comment'); // Предполагаем, что модель Comment уже создана

async function pollQueue() {
    const params = {
        QueueUrl: queueUrl,
        MaxNumberOfMessages: 10,
        WaitTimeSeconds: 20,
    };

    try {
        const data = await sqs.receiveMessage(params).promise();
        if (data.Messages) {
            for (const message of data.Messages) {
                try {
                    await processComment(message);
                    await deleteMessage(message.ReceiptHandle);
                } catch (error) {
                    console.error('Error processing message:', error);
                }
            }
        }
    } catch (error) {
        console.error('Receive Error:', error);
    }
}

async function processComment(message) {
    const body = JSON.parse(message.Body);
    if (!body || !body.userId) {
        console.error("Message body is invalid or missing 'userId'");
        return; // Прерываем обработку, если сообщение некорректно
    }

    const comment = new Comment({
        text: body.text,
        user: new mongoose.Types.ObjectId(body.userId), // Исправлено здесь
        fileUrl: body.fileUrl,
        parentId: body.parentId || null,
    });

    try {
        await comment.save();
        console.log('Comment saved to MongoDB:', comment._id);
    } catch (error) {
        console.error('Error saving comment to MongoDB:', error);
    }
}

async function deleteMessage(receiptHandle) {
    const deleteParams = {
        QueueUrl: queueUrl,
        ReceiptHandle: receiptHandle,
    };
    try {
        await sqs.deleteMessage(deleteParams).promise();
        console.log('Message deleted from SQS:', receiptHandle);
    } catch (error) {
        console.error('Error deleting message from SQS:', error);
    }
}

setInterval(pollQueue, 5000);

module.exports = { pollQueue };
