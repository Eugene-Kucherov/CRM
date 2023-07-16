const { Schema, model } = require("mongoose");

const dialogueSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  lastMessage: { type: Schema.Types.ObjectId, ref: "Message", required: true },
});

module.exports = model("Dialogue", dialogueSchema);
