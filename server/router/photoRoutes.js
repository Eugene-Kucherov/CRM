const Router = require("express").Router;
const photoController = require("../controllers/photo");
const userController = require("../controllers/user");
const upload = require("./upload");

const router = new Router();

router.post("/:userId", upload.single("photo"), photoController.uploadPhoto);
router.get("/:userId", photoController.getPhoto);
router.delete("/:userId", photoController.deletePhoto);

module.exports = router;
