const express = require("express");
const budgetController = require("./../controllers/budgetController");
const authController = require("./../controllers/authController");
const router = express.Router();

router.use(authController.protect);
router.post("/", budgetController.createBudget);
router.delete("/:budgetId", budgetController.createBudget);
router.get("/me", budgetController.getAllBudgetOfLoggedInUser);
router.post("/me/:budgetId", budgetController.updateBudget);

module.exports = router;
