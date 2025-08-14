const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Expense = require("./../models/expenseModel");
const AIServices = require("./../services/AIService");

exports.getYearlySummary = catchAsync(async (req, res, next) => {
  //   console.log(req.user);
  const t_past_years = req.query.past ? parseInt(req.query.past) : 1;
  const minYear = new Date().getFullYear() - t_past_years;

  if (isNaN(minYear) || minYear < 2000 || t_past_years < 0)
    return next(
      new AppError(
        "Invalid count for past year! Try using some valid value for past!"
      )
    );

  const report = await Expense.aggregate([
    {
      $addFields: {
        year: { $year: "$date" },
        month: { $month: "$date" },
      },
    },
    {
      $match: {
        user: req.user._id,
        year: { $gte: minYear },
      },
    },
    {
      $group: {
        _id: { year: "$year", month: "$month", name: "$name" },
        itemExpense: { $sum: { $multiply: ["$quantity", "$unitPrice"] } },
      },
    },
    {
      $group: {
        _id: { year: "$_id.year", month: "$_id.month" },
        totalMonthlyExpense: { $sum: "$itemExpense" },
        items: {
          $push: {
            name: "$_id.name",
            expense: "$itemExpense",
          },
        },
      },
    },
    {
      $group: {
        _id: "$_id.year",
        totalYearlyExpense: { $sum: "$totalMonthlyExpense" },
        months: {
          $push: {
            month: "$_id.month",
            totalMonthlyExpense: "$totalMonthlyExpense",
            items: "$items",
          },
        },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
  ]);

  const summary = await AIServices.generateYearlySummary(report);

  res.status(200).json({
    status: "success",
    data: summary,
  });
});

exports.voiceCommand = catchAsync(async (req, res, next) => {
  // just analysis the expense and recurring expense related commands
  const response = await AIServices.voiceCommandforExpenses(req.body.text);
  res.status(200).json({
    status: "success",
    message: response,
  });
});
