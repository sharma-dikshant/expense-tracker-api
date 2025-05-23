const express = require("express");
const viewController = require("./../controllers/viewController");

const router = express.Router();

router.route("/").get(viewController.getLandingPage);
router.route("/forgetPassword").get(viewController.getForgetPassword);
router.route("/resetPassword/:token").get(viewController.getResetPassword);

module.exports = router;
