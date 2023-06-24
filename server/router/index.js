const Router = require("express").Router;
const mainRoutes = require("./mainRoutes");
const userRoutes = require("./userRoutes");
const eventRoutes = require("./eventRoutes");
const dealRoutes = require("./dealRoutes");
const photoRoutes = require("./photoRoutes");
const messagesRoutes = require("./messagesRoutes");
const userController = require("../controllers/user");
const dealController = require("../controllers/deal");


const router = new Router();

router.use("/", mainRoutes);
router.use("/users", userRoutes);
router.use("/photos", photoRoutes);
router.use("/events", eventRoutes);
router.use("/deal", dealRoutes);
router.get("/deals/:userId", userController.checkAuth, dealController.getDeals);
router.use("/messages", messagesRoutes);

module.exports = router;
