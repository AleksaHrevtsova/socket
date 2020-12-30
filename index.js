const path = require("path");
const express = require("express");
const app = express();
const http = require("http").Server(app);

// добавляем сокет на наш сервер
const io = require("socket.io")(http);

app.use(express.static(path.resolve(__dirname, "public")));

// история сообщений и пользователей
const history = [];
const users = {};

// Send from server to client
io.on("connection", (socket) => {
  // console.log(socket);
  console.log("New user connected");
  console.log(`Hello`);

  // подключение нового пользователя
  socket.on("user/joinChat", (name) => {
    console.log(`new user ${name} connected`);
    users[socket.id] = name;

    // to new user
    socket.emit("user/joinChatSuccess", `${name} - welcome to our chat`);
    socket.emit("user/connected", history);
    console.log(`history`, history, name);
    // to all another users
    socket.broadcast.emit("chat/userJoined", `${name} connected to the chat`);
  });

  socket.on("chat/newMessage", (msg) => {
    console.log(msg);
    const entry = {
      author: users[socket.id],
      msg,
      time: Date.now(),
    };
    history.push(entry);
    io.emit("chat/newMessage", entry);
  });

  socket.on("disconnect", (msg) => {
    console.log(msg);
  });
});

// ==========================
let port = 8080;
http.listen(port, function () {
  console.log(`HTTP server started on port ${port}`);
});
