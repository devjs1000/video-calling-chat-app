const io = require("socket.io")(8000, {
  cors: {
    origin: "*",
  },
});

var users = {};
io.on("connection", (socket) => {
  socket.on("meeting", (roomId, userId) => {
    socket.join(roomId);
    console.log(roomId);
    console.log(userId);
    socket.broadcast.emit("user-joined-meeting", userId);
  });
  socket.on("join", (name) => {
    users[socket.id] = name;
    socket.broadcast.emit("new", name);
  });
  socket.on("disconnect", () => {
    socket.broadcast.emit("left", users[socket.id]);
    delete users[socket.id];
  });
  socket.on("send", (message) => {
    if (message.type == "text") {
      socket.broadcast.emit("message", {
        name: users[socket.id],
        message: message.msg,
        type: "text",
      });
    }
    if (message.type == "file") {
      socket.broadcast.emit("message", {
        name: users[socket.id],
        url: message.url,
        type: "file",
      });
    }
  });
});
