const Router = require("express").Router;
const eventController = require("../controllers/event");
const userController = require("../controllers/user");

const router = new Router();

router.post("/", userController.checkAuth, eventController.createEvent);
router.get("/:userId", userController.checkAuth, eventController.getEvents);
router.delete(
  "/:eventId",
  userController.checkAuth,
  eventController.deleteEvent
);

module.exports = router;
