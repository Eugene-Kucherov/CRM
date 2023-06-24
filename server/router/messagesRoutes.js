const Router = require("express").Router;
const messageController = require("../controllers/message");
const userController = require("../controllers/user");

const router = new Router();

router.post("/", userController.checkAuth, messageController.sendMessage);
router.get(
  "/:senderId/:recipientId",
  userController.checkAuth,
  messageController.getMessagesBetweenUsers
);

module.exports = router;
