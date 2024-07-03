import express from 'express';
import cors from 'cors';
import path from 'path';
import reload from 'reload';

import { createMessagesApi } from './api.mjs';

export const app = express();
const port = 8001;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

createMessagesApi(app);

app.use(express.static(path.resolve('./dist')));

app.get('/', (_, res) => {
    res.sendFile(path.resolve('./dist/index.html'));
  });

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

reload(app);