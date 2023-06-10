const path = require("path");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const fileName = `${uuidv4()}${extension}`;
    cb(null, fileName);
  },
});
const upload = multer({ storage: storage });

module.exports = upload;
