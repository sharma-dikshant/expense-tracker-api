const express = require("express");
const recurringExpenseController = require("./../controllers/recurringExpenseController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.use(authController.protect);
router.post("/", recurringExpenseController.createRecurringExpense);
router.patch("/:id", recurringExpenseController.updateRecurringExpense);
router.delete("/:id", recurringExpenseController.deleteRecurringExpense);
router.get(
  "/me",
  recurringExpenseController.getAllRecurringExpensesOfLoggedInUser
);

module.exports = router;
