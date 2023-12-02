const MessageModel = require("../models/message");
const DialogueModel = require("../models/dialogue");
const PhotoModel = require("../models/photo");
const UserModel = require("../models/user");
const MessageDTO = require("../dtos/message");
const { Types } = require("mongoose");

class MessageService {
  async sendMessage(messageData) {
    const message = await MessageModel.create(messageData);

    const participants = [message.sender, message.recipient].map(String).sort();

    const [sender, recipient] = await Promise.all([
      UserModel.findById(message.sender),
      UserModel.findById(message.recipient),
    ]);

    const [senderPhoto, recipientPhoto] = await Promise.all([
      PhotoModel.findOne({ userId: message.sender }),
      PhotoModel.findOne({ userId: message.recipient }),
    ]);

    const SenderPhotoData = senderPhoto
      ? `data:${
          senderPhoto.contentType
        };base64,${senderPhoto.photoData.toString("base64")}`
      : null;

    const RecipientPhotoData = recipientPhoto
      ? `data:${
          recipientPhoto.contentType
        };base64,${recipientPhoto.photoData.toString("base64")}`
      : null;

    const dialoguePartners = [
      {
        user: message.sender,
        username: sender.name,
        photo: SenderPhotoData,
      },
      {
        user: message.recipient,
        username: recipient.name,
        photo: RecipientPhotoData,
      },
    ];

    const existingDialogue = await DialogueModel.findOne({ participants });

    if (existingDialogue) {
      existingDialogue.lastMessage = message;
      await existingDialogue.save();
      message.dialogue = existingDialogue._id;
      await message.save();
    } else {
      const newDialogue = await DialogueModel.create({
        participants,
        dialoguePartners,
        lastMessage: message,
      });
      message.dialogue = newDialogue._id;
      await message.save();
    }

    const messageDTO = new MessageDTO(message);
    return messageDTO;
  }

  async getMessages(dialogueId, userId) {
    const messages = await MessageModel.find({
      dialogue: dialogueId,
    }).sort({ created_at: 1 });

    await Promise.all(
      messages.map(async (message) => {
        if (!message.is_read && message.recipient.toString() === userId) {
          message.is_read = true;
          await message.save();
        }
      })
    );

    return messages.map((message) => new MessageDTO(message));
  }

  async deleteMessage(messageId) {
    const message = await MessageModel.findById(messageId);
    if (!message) {
      throw new Error("Message not found");
    }

    message.is_deleted = true;
    await message.save();

    const previousMessage = await MessageModel.findOne({
      dialogue: message.dialogue,
      is_deleted: false,
      _id: { $ne: messageId },
    }).sort({ created_at: -1 });

    const participants = [message.sender, message.recipient].map(String).sort();

    const existingDialogue = await DialogueModel.findOne({ participants });
    if (existingDialogue) {
      existingDialogue.lastMessage = previousMessage || null;
      await existingDialogue.save();
    }
  }

  async getDialogues(userId) {
    const dialogues = await DialogueModel.find({
      participants: userId,
    })
      .populate("dialoguePartners.user", "username")
      .populate({
        path: "lastMessage",
        populate: {
          path: "sender recipient",
          select: "username",
        },
      })
      .lean()
      .exec();

    for (const dialogue of dialogues) {
      dialogue.unreadNumber = await this.countUnreadMessages(dialogue._id);
    }

    return dialogues;
  }

  async countUnreadMessages(dialogueId) {
    const objDialogue = new Types.ObjectId(dialogueId);
    const unreadCount = await MessageModel.countDocuments({
      dialogue: objDialogue,
      is_read: false,
    });

    return unreadCount;
  }

  async getDialogue(dialogueId) {
    const dialogue = await DialogueModel.findById(dialogueId)
      .populate("dialoguePartners.user", "username")
      .populate({
        path: "lastMessage",
        populate: {
          path: "sender recipient",
          select: "username",
        },
      })
      .lean()
      .exec();

    dialogue.unreadNumber = await this.countUnreadMessages(dialogueId);

    return dialogue;
  }
}

module.exports = new MessageService();
