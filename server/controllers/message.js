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

  async getMessages(req, res) {
    try {
      const { senderId, recipientId } = req.params;
      const messages = await MessageService.getMessages(senderId, recipientId);
      return res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve messages" });
    }
  }

  async deleteMessage(req, res) {
    try {
      const { messageId } = req.params;
      const result = await MessageService.deleteMessage(messageId);
      return res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to delete message" });
    }
  }

  
}

module.exports = new MessageController();
