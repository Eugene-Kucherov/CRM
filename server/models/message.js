const { Schema, model } = require("mongoose");

const messageSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

messageSchema.statics.getMessagesBetweenUsers = function (
  senderId,
  recipientId
) {
  return this.find({
    $or: [
      { sender: senderId, recipient: recipientId },
      { sender: recipientId, recipient: senderId },
    ],
  }).sort({ created_at: 1 });
};

module.exports = model("Message", messageSchema);
