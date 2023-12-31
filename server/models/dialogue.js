const { Schema, model } = require("mongoose");

const dialogueSchema = new Schema({
  creator: { type: String, required: true },
  participants: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  dialoguePartners: [
    {
      user: { type: Schema.Types.ObjectId, ref: "User", required: true },
      username: { type: String, required: true },
      photo: { type: String, ref: "Photo" },
    },
  ],
  lastMessage: { type: Schema.Types.ObjectId, ref: "Message" },
  unreadNumber: { type: Number },
});

module.exports = model("Dialogue", dialogueSchema);
