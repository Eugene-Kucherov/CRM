const { Schema, model } = require("mongoose");

const EventSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  start: { type: Date, required: true, default: Date.now },
  end: { type: Date, required: true },
});

module.exports = model("Event", EventSchema);
