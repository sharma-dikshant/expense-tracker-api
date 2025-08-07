const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, "Please provide an amount"],
      min: [1, "amount should be greater than 1"],
    },
    category: {
      type: String,
      default: "none",
    },
    description: String,
    date: {
      type: Date,
      max: [Date.now, "Date should be till today"],
      required: [true, "Please provide date for expense"],
      validate: {
        validator: function (value) {
          return value instanceof Date && !isNaN(value);
        },
        message: "Invalid date format",
      },
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "User is required to create expense"],
    },
    budget: {
      type: mongoose.Schema.ObjectId,
      ref: "Budget",
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const Expense = mongoose.model("Expense", expenseSchema);
module.exports = Expense;
