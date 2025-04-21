const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
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
    date: {
      type: Date,
      // default: Date.now,
      required: [true, "Please provide date for expense"],
      validate: {
        validator: function (value) {
          return value instanceof Date && !isNaN(value);
        },
        message: "Invalid date format",
      },
    },
    user: {
      type: String,
      required: [true, "No user for this expense"],
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

expenseSchema.virtual("totalPrice").get(function () {
  return this.quantity * this.unitPrice;
});

const Expense = mongoose.model("Expense", expenseSchema);
module.exports = Expense;
