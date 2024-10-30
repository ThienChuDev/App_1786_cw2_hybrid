const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const router = require("./routers/router");
const app = express();
const cookieParser = require("cookie-parser");
require("dotenv").config();
const { connectDatabase } = require("./config/firebase");
const port = 3000;
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server);
app.use(cookieParser());
app.use(
  cors({
    origin: `http://192.168.1.4:${port}`,
    methods: ["GET", "PUT", "POST", "DELETE"],
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));
app.use((req, res, next) => {
  res.io = io;
  next();
});

router(app);
server.listen(port, async () => {
  console.log(`run server http://192.168.1.4:${port}`);
  await connectDatabase();
});
