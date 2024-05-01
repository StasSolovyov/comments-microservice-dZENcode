const { sqs, queueUrl } = require('../config/awsConfig');
const Comment = require('../models/Comment'); // Модель комментария для MongoDB

// Функция для обработки сообщений из SQS
async function processMessages() {
    const params = {
        QueueUrl: queueUrl,
        MaxNumberOfMessages: 10, // Количество сообщений для получения за один раз
        WaitTimeSeconds: 20, // Long Polling
    };

    try {
        const data = await sqs.receiveMessage(params).promise();
        if (data.Messages) {
            for (const message of data.Messages) {
                try {
                    const body = JSON.parse(message.Body);
                    const comment = new Comment({
                        text: body.text,
                        user: body.user.userId, // Ссылка на ObjectId пользователя
                        fileUrl: body.fileUrl,
                        // Добавление parentId, если это ответ на другой комментарий
                        parentId: body.parentId ? body.parentId : null,
                    });

                    await comment.save(); // Сохраняем комментарий в MongoDB
                    await sqs
                        .deleteMessage({
                            QueueUrl: queueUrl,
                            ReceiptHandle: message.ReceiptHandle,
                        })
                        .promise();
                    console.log('Comment saved and message deleted from SQS');
                } catch (error) {
                    console.error('Error processing message:', error);
                }
            }
        }
    } catch (error) {
        console.error('Error receiving messages:', error);
    }
}

// Запускаем функцию обработки сообщений
processMessages();
