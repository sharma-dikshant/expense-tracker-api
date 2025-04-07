const express = require("express");
const {
  getAllExpense,
  createExpense,
  updateExpense,
  deleteExpense,
} = require("./../controllers/expenseController");

const router = express.Router();

router
  .route("/")
  .get(getAllExpense)
  .post(createExpense)
  .patch(updateExpense)
  .delete(deleteExpense);

module.exports = router;
