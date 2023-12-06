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
    console.log("An user connected");

    socket.on("createDialogue", async ({ senderId, recipientId }) => {
      try {
        const dialogue = await MessageService.createDialogue(
          senderId,
          recipientId
        );
        socket.emit("dialogueCreated", dialogue);
      } catch (error) {
        console.error("Failed to create dialogue:", error);
      }
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
        socket.emit("messages", messages);
      } catch (error) {
        console.error("Failed to get messages:", error);
      }
    });

    socket.on("sendMessage", async (messageData) => {
      try {
        const message = await MessageService.sendMessage(messageData);
        socket.emit("message", message);
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    });

    socket.on("updateMessage", async ({ messageId, updatedContent }) => {
      try {
        const updatedMessage = await MessageService.updateMessage(
          messageId,
          updatedContent
        );
        socket.emit("messageUpdated", updatedMessage);
      } catch (error) {
        console.error("Failed to update message:", error);
      }
    });

    socket.on("deleteMessage", async (messageId) => {
      try {
        await MessageService.deleteMessage(messageId);
        socket.emit("messageDeleted", messageId);
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
