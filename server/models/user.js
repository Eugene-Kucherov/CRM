const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  isActivated: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  blockedUntil: { type: Date, default: null },
  count: { type: Number, default: 0 },
  phone: { type: String, default: "" },
  address: { type: String, default: "" },
});

module.exports = model("User", UserSchema);
