const Budget = require("./../models/budgetModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const ApiResponse = require("./../utils/ApiResponse");

exports.createBudget = catchAsync(async (req, res, next) => {
  const budget = await Budget.create({
    ...req.body,
    user: req.user._id,
  });
  return new ApiResponse(200, "success", budget).send(res);
});
exports.updateBudget = catchAsync(async (req, res, next) => {
  const newBudget = await Budget.findByIdAndUpdate(
    req.params.budgetId,
    req.body,
    { new: true }
  );
  return new ApiResponse(200, "success", newBudget).send(res);
});
exports.deleteBudget = catchAsync(async (req, res, next) => {
  await Budget.findByIdAndDelete(req.params.budgetId);
  return new ApiResponse(204, "success", null).send(res);
});
exports.getAllBudgetOfLoggedInUser = catchAsync(async (req, res, next) => {
  const budgets = await Budget.find({ user: req.user._id });
  return new ApiResponse(200, "success", budgets).send(res);
});
