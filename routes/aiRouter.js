const express = require("express");
const aiController = require("./../controllers/aiController");
const authController = require("./../controllers/authController");
const router = express.Router();

const tempRes = (req, res) => {
  res.status(200).json({
    status: "success",
    message: "This route is under development!",
  });
};

router
  .route("/summary")
  .get(authController.protect, aiController.getYearlySummary);
router.route("/predict-expense").get(tempRes);
router.route("/chat").get(tempRes);

module.exports = router;
