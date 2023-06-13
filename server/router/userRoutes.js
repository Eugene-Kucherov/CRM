const Router = require("express").Router;
const userController = require("../controllers/user");

const router = new Router();

router.get("/:userId", userController.checkAuth, userController.getUser);
router.patch("/:userId", userController.checkAuth, userController.updateUser);
router.delete("/:userId", userController.deleteUser);

module.exports = router;
