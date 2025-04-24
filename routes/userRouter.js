const express = require("express");
const authController = require("./../controllers/authController");

const router = express.Router();

router.route("/signup").post(authController.signUp);
router.route("/login").post(authController.login);
router.route("/logout").post(authController.logout);
router
  .route("/getUser")
  .get(authController.protect, authController.getUserFromJWT);

module.exports = router;
