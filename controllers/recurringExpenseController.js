const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const ApiResponse = require("./../utils/ApiResponse");
const RecurringExpense = require("../models/RecurringExpenseModel");

exports.createRecurringExpense = catchAsync(async (req, res, next) => {
  const doc = await RecurringExpense.create({
    ...req.body,
    user: req.user._id,
  });

  return new ApiResponse(200, "success", doc).send(res);
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

  return new ApiResponse(
    200,
    "recurring expense updated successfully",
    newDoc
  ).send(res);
});

exports.deleteRecurringExpense = catchAsync(async (req, res, next) => {});

exports.getAllRecurringExpensesOfLoggedInUser = catchAsync(
  async (req, res, next) => {
    const expenses = await RecurringExpense.find({ user: req.user._id });

    return new ApiResponse(200, "success", expenses).send(res);
  }
);
