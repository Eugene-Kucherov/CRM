const Router = require("express").Router;
const dealController = require("../controllers/deal");
const userController = require("../controllers/user");

const router = new Router();

router.post("/", userController.checkAuth, dealController.createDeal);
router.get("/:dealId", userController.checkAuth, dealController.getDeal);
router.patch("/:dealId", userController.checkAuth, dealController.updateDeal);
router.delete("/:dealId", userController.checkAuth, dealController.deleteDeal);

module.exports = router;

