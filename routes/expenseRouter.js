const express = require("express");
const {
  getAllExpense,
  createExpense,
  updateExpense,
  deleteExpense,
  getMonthExpense,
  getYearExpense,
} = require("./../controllers/expenseController");

const router = express.Router();

router.route("/").get(getAllExpense).post(createExpense).delete(deleteExpense);
router.route("/:id").patch(updateExpense);

router.route("/stats/month/:month").get(getMonthExpense);
router.route("/stats/year/:year").get(getMonthExpense);

module.exports = router;
