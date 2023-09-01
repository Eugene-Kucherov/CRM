const socketIO = require("socket.io");
const MessageService = require("./service/message");

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

    socket.on("getMessages", async ({ senderId, recipientId }) => {
      try {
        const messages = await MessageService.getMessages(
          senderId,
          recipientId
        );
        io.emit("messages", messages);
      } catch (error) {
        console.error("Failed to get messages:", error);
      }
    });

    socket.on("sendMessage", async (messageData) => {
      try {
        const message = await MessageService.sendMessage(messageData);
        io.emit("message", message);
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    });

    socket.on("deleteMessage", async (messageId) => {
      try {
        await MessageService.deleteMessage(messageId);

        io.emit("messageDeleted", messageId);
      } catch (error) {
        console.error("Failed to delete message:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
};

module.exports = webSocket;
