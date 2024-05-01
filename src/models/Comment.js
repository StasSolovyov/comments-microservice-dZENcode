const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true, // Убеждаемся, что текст комментария всегда предоставляется
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true, // Ссылка на пользователя должна быть обязательной
    },
    createdAt: {
        type: Date,
        default: Date.now, // Автоматическая установка времени создания
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        required: false, // Сделаем этот параметр необязательным, так как не все комментарии будут ответами
    },
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
