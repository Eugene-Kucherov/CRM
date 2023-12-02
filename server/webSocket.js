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

    socket.on("joinRoom", (dialogueId) => {
      socket.join(dialogueId);
    });

    socket.on("getDialogues", async (userId) => {
      try {
        const dialogues = await MessageService.getDialogues(userId);
        socket.emit("dialogues", dialogues);
      } catch (error) {
        console.error("Failed to get dialogues:", error);
      }
    });

    socket.on("getMessages", async ({ dialogueId, userId }) => {
      try {
        const messages = await MessageService.getMessages(dialogueId, userId);
        io.to(dialogueId.toString()).emit("messages", messages);
      } catch (error) {
        console.error("Failed to get messages:", error);
      }
    });

    socket.on("sendMessage", async (messageData) => {
      try {
        const message = await MessageService.sendMessage(messageData);
        io.to(message.dialogue.toString()).emit("message", message);
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
