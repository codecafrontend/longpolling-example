import express from 'express';

export const createMessagesApi = (app) => {
    // История сообщений
    const allMessages = [
        {
            user: { name: 'bot', id: '' },
            text: 'Hello world!',
            timestamp: new Date().toISOString(),
        },
    ];

    // Очередь для long polling
    const messagesQueue = {};

    // Route для отправки сообщений на сервер
    app.post('/send', express.json(), (req, res) => {
        const { message } = req.body;

        allMessages.push(message);

        // Добавляем сообщение в очередь всем, кроме автора сообщения
        Object.keys(messagesQueue).forEach((key) => {
            if (key !== message.user.id) {
                messagesQueue[key] = [...(messagesQueue[key] ?? []), message];
            }
        });

        res.status(200).send('Message received');
    });

    // Route для long polling
    app.get('/poll', (req, res) => {
        const { userId } = req.query;

        function checkForMessages() {
            if (messagesQueue[userId]?.length > 0) {
                const messages = messagesQueue[userId];
                messagesQueue[userId] = [];
                res.json(messages);
            } else {
                // Проверяем сообщения каждые 500 мс
                setTimeout(checkForMessages, 500);
            }
        }

        checkForMessages();
    });

    // Route для получения истории
    app.get('/history', (_, res) => {
        res.json(allMessages);
    });
};
