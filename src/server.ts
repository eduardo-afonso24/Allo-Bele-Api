// server.ts

import http from "http";
import app from "./app";
const server = http.createServer(app);


const PORT = 3000;

server.listen(PORT, () => {
  console.log(` === SERVER IS RUNNING ON PORT [${PORT}] === `);
});