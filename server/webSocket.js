const socketIO = require("socket.io");

const webSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST", "DELETE"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("sendMessage", async (messageData) => {
      io.emit("message", messageData);
    });

    socket.on("deleteMessage", async (messageId) => {
      io.emit("messageDeleted", messageId);
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
};

module.exports = webSocket;
