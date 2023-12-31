const { Schema, model } = require("mongoose");

const messageSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: null},
  is_deleted: { type: Boolean, default: false },
  is_read: { type: Boolean, default: false },
  dialogue: { type: Schema.Types.ObjectId, ref: "Dialogue" },
});

module.exports = model("Message", messageSchema);
