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
      min: [1, "unit price should be greater than 1"],
    },
    quantity: {
      type: Number,
      required: [true, "Please provide a quantity"],
      min: [1, "quantity should be greater than 1"],
    },
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
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

expenseSchema.virtual("totalPrice").get(function () {
  return this.quantity * this.unitPrice;
});

const Expense = mongoose.model("Expense", expenseSchema);
module.exports = Expense;
