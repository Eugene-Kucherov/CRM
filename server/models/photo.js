const { Schema, model } = require("mongoose");

const photoSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  fileName: {
    type: String,
    required: true,
  },
  photoData: {
    type: Buffer,
    required: true,
  },
  contentType: {
    type: String,
    required: true,
  },
});

module.exports = model("Photo", photoSchema);
