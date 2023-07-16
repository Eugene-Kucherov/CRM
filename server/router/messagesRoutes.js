const Router = require("express").Router;
const messageController = require("../controllers/message");
const userController = require("../controllers/user");

const router = new Router();

router.post("/", userController.checkAuth, messageController.sendMessage);
router.get(
  "/:senderId/:recipientId",
  userController.checkAuth,
  messageController.getMessages
);
router.delete(
  "/:messageId",
  userController.checkAuth,
  messageController.deleteMessage
);
router.get(
  "/dialogues",
  userController.checkAuth,
  messageController.getDialogues
);

module.exports = router;
