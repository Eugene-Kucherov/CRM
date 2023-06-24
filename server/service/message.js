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
  async getMessagesBetweenUsers(senderId, recipientId) {
    const messages = await MessageModel.getMessagesBetweenUsers(
      senderId,
      recipientId
    );
    return messages.map((message) => new MessageDTO(message));
  }
}

module.exports = new MessageService();
