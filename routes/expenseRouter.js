const express = require("express");
const {
  getAllExpense,
  createExpense,
  updateExpense,
  deleteExpense,
} = require("./../controllers/expenseController");

const router = express.Router();

router.route("/").get(getAllExpense).post(createExpense).delete(deleteExpense);
router.route("/:id").patch(updateExpense);

module.exports = router;
