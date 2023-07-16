const MessageModel = require("../models/message");
const MessageDTO = require("../dtos/message");

class MessageService {
  async sendMessage(messageData) {
    const message = await MessageModel.create(messageData);
    const messageDTO = new MessageDTO(message);
    return {
      message: messageDTO,
    };
  }

  async getMessages(senderId, recipientId) {
    const messages = await MessageModel.find({
      $or: [
        { sender: senderId, recipient: recipientId },
        { sender: recipientId, recipient: senderId },
      ],
    }).sort({ created_at: 1 });

    return messages.map((message) => new MessageDTO(message));
  }

  async deleteMessage(messageId) {
    const message = await MessageModel.findById(messageId);
    if (!message) {
      throw new Error("Message not found");
    }

    message.is_deleted = true;
    await message.save();
  }

  
}

module.exports = new MessageService();
