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
  console.log("New user connected");

  socket.on("user/joinChat", (userName) => {
    console.log(`new user ${userName} connected`);
    users[socket.id] = userName;
    // to new user
    socket.emit("user/joinChatSuccess", `${userName} - welcome to our chat`);
    socket.emit("user/connected", history);
    // to all another users
    socket.broadcast.emit(
      "chat/userJoined",
      `${userName} connected to the chat`,
    );
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

  socket.on("disconnect", () => {
    console.log(`User left the chat`);
  });
});

// ==========================
let port = 8080;
http.listen(port, function () {
  console.log(`HTTP server started on port ${port}`);
});
