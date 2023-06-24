const MessageService = require("../service/message");

class MessageController {
  async sendMessage(req, res) {
    try {
      const messageData = await MessageService.sendMessage(req.body);
      return res.status(201).json(messageData);
    } catch (error) {
      res.status(500).json({ error: "Failed to send message" });
    }
  }

  async getMessagesBetweenUsers(req, res) {
    try {
      const { senderId, recipientId } = req.params;
      const messages = await MessageService.getMessagesBetweenUsers(
        senderId,
        recipientId
      );
      return res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve messages" });
    }
  }
}

module.exports = new MessageController();
