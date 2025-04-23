const express = require("express");
const expenseController = require("./../controllers/expenseController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.use(authController.protect);
router
  .route("/")
  .get(expenseController.getAllExpense)
  .post(expenseController.createExpense)
  .delete(expenseController.deleteExpense);
router
  .route("/:id")
  .patch(expenseController.updateExpense)
  .delete(expenseController.deleteExpense);

router.route("/stats/month/:month").get(expenseController.getMonthExpense);
router.route("/stats/year/:year").get(expenseController.getYearExpense);

module.exports = router;
