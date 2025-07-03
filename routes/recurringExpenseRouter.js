const express = require("express");
const recurringExpenseController = require("./../controllers/recurringExpenseController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.use(authController.protect);
router.post("/create", recurringExpenseController.createRecurringExpense);
router.patch("/:id", recurringExpenseController.updateRecurringExpense);
router.delete("/:id", recurringExpenseController.deleteRecurringExpense);

module.exports = router;
