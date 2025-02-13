import express from 'express';
import cors from 'cors';
import 'reflect-metadata';
import 'express-async-errors';
import { Server as SocketIOServer } from 'socket.io';
import logger from 'morgan'
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import path from 'path';
import http from "http";
import routes from './infra/http/routes';
import { connectDB } from './infra';
import { handleSocketConnection } from './infra/http/controllers/socket';


const app = express();

app.use(express.json({ limit: '500mb' }));
app.use(logger('dev'));

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.use(express.urlencoded({ limit: '500mb', extended: false }));

app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

connectDB();
app.use(routes);

// const server = http.createServer(app);

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

handleSocketConnection(io);


const PORT = 3000;

server.listen(PORT, () => {
  console.log(` === SERVER IS RUNNING ON PORT [${PORT}] === `);
});



export default app;