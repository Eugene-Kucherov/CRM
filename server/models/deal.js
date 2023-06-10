const { Schema, model } = require("mongoose");

const DealSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  stage: { type: Number, required: true },
  name: { type: String, required: true },
  email: { type: String, default: "" },
  phone: { type: String, default: "" },
  company: { type: String, default: "" },
  website: { type: String, default: "" },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  notes: { type: String, default: "" },
});

module.exports = model("Deal", DealSchema);
