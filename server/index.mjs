import express from 'express';
import cors from 'cors';
import path from 'path';
import browserSync from 'browser-sync';

import { createMessagesApi } from './api.mjs';

export const app = express();
const port = 8000;
const proxyPort = 8001;

app.use(
    cors({
        origin: '*',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
    }),
);

createMessagesApi(app);

app.use(express.static(path.resolve('./dist')));

app.get('/', (_, res) => {
    res.sendFile(path.resolve('./dist/index.html'));
});

app.listen(proxyPort, () => {
    console.log(`Server running on http://localhost:${proxyPort}`);
});

if (process.env.IS_DEV) {
    browserSync({
        port,
        proxy: `localhost:${proxyPort}`,
        files: ['dist/**/*']
    });
}
