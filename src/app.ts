import express from 'express';
import cors from 'cors';
import 'reflect-metadata';
import 'express-async-errors';
import { fileURLToPath } from 'url';
import path from 'path';
import http from "http";
import routes from './infra/http/routes';
import { connectDB } from './infra';
import { initSocket } from './infra/http/controllers/socket/sockets';

const app = express();

app.use(cors());
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: false }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

connectDB();
app.use(routes);

const server = http.createServer(app);
initSocket(server);

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🚀 SERVER IS RUNNING ON PORT [${PORT}]`);
});

export default app;
