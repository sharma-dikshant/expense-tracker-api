const mongoose = require("mongoose");

const recurringExpenseSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "owner is required!"],
  },
  name: {
    type: String,
    lowercase: true,
    required: [true, "recurring expense should have title"],
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
  frequency: {
    type: String,
    enum: ["daily", "weekly", "monthly"],
    required: [true, "please specify frequency"],
  },
  dayOfWeek: {
    type: Number,
    min: [0, "min day can be 0"],
    max: [6, "max day can be 6"],
    default: null,
  },
  dayOfMonth: {
    type: Number,
    min: [1, "min day can be 1"],
    max: [28, "max day can be 28"],
    default: null,
  },
  startDate: {
    type: Date,
    default: Date.now,
    validate: {
      validator: function (value) {
        return value >= new Date().setHours(0, 0, 0, 0);
      },
      message: "start date can't be in past",
    },
  },
  endDate: {
    type: Date,
    default: null,
  },
  active: {
    type: Boolean,
    default: true,
  },
  lastGeneratedDate: {
    type: Date,
    default: null,
  },
});

const RecurringExpense = mongoose.model(
  "RecurringExpense",
  recurringExpenseSchema
);
module.exports = RecurringExpense;
