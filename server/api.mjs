import express from 'express';

export const createMessagesApi = (app) => {
    // Хранилище для сообщений
    const messagesQueue = {};

    // Route для отправки сообщений на сервер
    app.post('/send', express.json(), (req, res) => {
        const { message, user } = req.body;
        
        Object.keys(messagesQueue).forEach((key) => {
            if (key !== user) {
                messagesQueue[key] = [...messagesQueue[key], message];
            }
        })
        res.status(200).send('Message received');
    });

    // Route для long polling
    app.get('/poll', (req, res) => {
        const { user } = req.query;

        if (!messagesQueue[user]) {
            // Чтобы чат изначально не был пустым
            messagesQueue[user] = [{
                user: 'bot',
                text: 'Hello world',
                timestamp: new Date().toISOString(),
            }];
        }

        function checkForMessages() {
            if (messagesQueue[user]?.length > 0) {
                const messages = messagesQueue[user];
                messagesQueue[user] = [];
                res.json(messages);
            } else {
                // Проверяем сообщения каждые 500 мс
                setTimeout(checkForMessages, 500);
            }
        }

        checkForMessages();
    });
};