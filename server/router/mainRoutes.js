const Router = require("express").Router;
const userController = require("../controllers/user");
const router = new Router();

router.post("/registration", userController.registration);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/refresh", userController.refresh);
router.head("/activate/:userId", userController.activateAccount);

module.exports = router;
