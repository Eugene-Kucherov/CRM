const Router = require("express").Router;
const userController = require("../controllers/user");
const dealController = require("../controllers/deal");
const photoController = require("../controllers/photo");
const upload = require("./upload");
const router = new Router();

router.post(
  "/photos/:userId",
  upload.single("photo"),
  photoController.uploadPhoto
);
router.get("/photos/:userId", photoController.getPhoto);
router.delete("/photos/:userId", photoController.deletePhoto);

router.head("/activate/:userId", userController.activateAccount);

router.post("/registration", userController.registration);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/refresh", userController.refresh);

router.get("/users/:userId", userController.checkAuth, userController.getUser);
router.patch(
  "/users/:userId",
  userController.checkAuth,
  userController.updateUser
);
router.delete(
  "/users/:userId",
  userController.checkAuth,
  userController.deleteUser
);

router.post("/deal", userController.checkAuth, dealController.createDeal);
router.get("/deals/:userId", userController.checkAuth, dealController.getDeals);
router.get("/deal/:dealId", userController.checkAuth, dealController.getDeal);
router.patch(
  "/deal/:dealId",
  userController.checkAuth,
  dealController.updateDeal
);
router.delete(
  "/deal/:dealId",
  userController.checkAuth,
  dealController.deleteDeal
);

module.exports = router;
