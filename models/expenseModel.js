const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    lowercase: true,
  },
  unitPrice: {
    type: Number,
    required: [true, "Please provide an amount"],
  },
  quantity: {
    type: Number,
    required: [true, "Please provide a quantity"],
  },
  totalPrice: Number,
  date: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: String,
    required: [true, "No user for this expense"],
  },
});

const Expense = mongoose.model("Expense", expenseSchema);
module.exports = Expense;
