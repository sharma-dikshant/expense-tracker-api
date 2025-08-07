const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const RecurringExpense = require("../models/RecurringExpenseModel");

exports.createRecurringExpense = catchAsync(async (req, res, next) => {
  const doc = await RecurringExpense.create({
    ...req.body,
    user: req.user._id,
  });

  res.status(200).json({
    message: "success",
    data: doc,
  });
});

exports.updateRecurringExpense = catchAsync(async (req, res, next) => {
  const q = req.body;
  if (q.user) {
    // cant update user
    delete q[user];
  }
  const newDoc = await RecurringExpense.findByIdAndUpdate(req.params.id, q, {
    new: true,
  });

  res.status(200).json({
    message: "recurring expense updated successfully",
    data: newDoc,
  });
});

exports.deleteRecurringExpense = catchAsync(async (req, res, next) => {});
