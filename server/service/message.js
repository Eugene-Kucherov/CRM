const MessageModel = require("../models/message");
const DialogueModel = require("../models/dialog");
const MessageDTO = require("../dtos/message");

class MessageService {
  async sendMessage(messageData) {
    const message = await MessageModel.create(messageData);

    // await DialogueModel.findOneAndUpdate(
    //   { user: message.sender },
    //   { lastMessage: message },
    //   { upsert: true }
    // );

    const messageDTO = new MessageDTO(message);
    return messageDTO;
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

    // await DialogueModel.findOneAndUpdate(
    //   { user: message.sender },
    //   { lastMessage: message },
    //   { upsert: true }
    // );
  }

  async getDialogues() {
    const dialogues = await DialogueModel.find()
      .populate("user", "username")
      .populate({
        path: "lastMessage",
        populate: {
          path: "sender recipient",
          select: "username",
        },
      })
      .exec();

    return dialogues;
  }
}

module.exports = new MessageService();
