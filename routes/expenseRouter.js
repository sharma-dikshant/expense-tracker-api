const express = require("express");
const { getAllExpense } = require("./../controllers/expenseController");

const router = express.Router();

router.get("/", getAllExpense);

module.exports = router;
