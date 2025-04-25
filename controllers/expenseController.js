const Expense = require("./../models/expenseModel");
const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");

exports.getAllExpense = catchAsync(async (req, res, next) => {
  const user = req?.user._id;
  if (!user) return next(new AppError("no user logged in!", 400));
  //! Filtering
  const queryObj = { ...req.query, user };
  const deletedFields = ["page", "limit", "sort", "fields", "month", "year"];
  deletedFields.forEach((el) => delete queryObj[el]);

  let query = Expense.find(queryObj);

  //Field limits
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    query = query.select(fields);
  }

  //pagination & limiting results
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 31;
  const skip = (page - 1) * limit;
  query = query.skip(skip).limit(limit);

  // filtering based on month or year
  const month = req.query.month
    ? Number(req.query.month)
    : new Date().getMonth() + 1;
  const year = req.query.year
    ? Number(req.query.year)
    : new Date().getFullYear();

  // Create boundaries in UTC
  let startDate = new Date(Date.UTC(year, month - 1, 1));
  let endDate = new Date(Date.UTC(year, month, 1));

  if (!req.query.month) {
    startDate = new Date(Date.UTC(year, 0, 1));
    endDate = new Date(Date.UTC(year, 11, 31));
  }

  query = query.find({
    date: {
      $gte: startDate,
      $lt: endDate,
    },
  });

  //awaiting query
  const expenses = await query;

  res.status(200).json({
    status: "success",
    results: expenses.length,
    data: {
      expenses,
    },
  });
});

exports.createExpense = catchAsync(async (req, res, next) => {
  const newDoc = await Expense.create({ ...req.body, user: req.user._id });
  res.status(200).json({
    status: "success",
    data: newDoc,
  });
});

exports.deleteExpense = catchAsync(async (req, res, next) => {
  const doc = await Expense.findByIdAndDelete(req.params.id);

  if (!doc) return next(new AppError("No expense found with that ID", 404));

  res.status(202).json({
    status: "success",
  });
});

exports.updateExpense = catchAsync(async (req, res, next) => {
  const newDoc = await Expense.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!newDoc) return next(new AppError("No expense found with that ID", 404));

  res.status(200).json({
    status: "success",
    data: newDoc,
  });
});

exports.getMonthExpense = catchAsync(async (req, res, next) => {
  const monthNumber = req.params.month * 1;
  const yearNumber = req.query.year * 1;

  if (!req.params.month || isNaN(monthNumber))
    return next(new AppError("valid month is required as param", 400));
  if (!req.query.year || isNaN(yearNumber))
    return next(new AppError("valid year is required as query", 400));

  const stats = await Expense.aggregate([
    {
      $addFields: {
        month: { $month: "$date" },
        year: { $year: "$date" },
      },
    },
    {
      $match: {
        user: req.user._id,
        year: yearNumber,
        month: monthNumber,
      },
    },
    {
      $group: {
        _id: {
          month: "$month",
          year: "$year",
        },
        monthExpense: { $sum: { $multiply: ["$quantity", "$unitPrice"] } },
      },
    },
    {
      $project: {
        _id: 0,
        month: "$_id.month",
        year: "$_id.year",
        monthExpense: 1,
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: stats,
  });
});

exports.getYearExpense = catchAsync(async (req, res, next) => {
  const yearNumber = req.params.year * 1;

  if (!req.params.year || isNaN(yearNumber))
    return next(new AppError("valid year is required as params", 400));

  const stats = await Expense.aggregate([
    {
      $addFields: {
        month: { $month: "$date" },
        year: { $year: "$date" },
      },
    },
    {
      $match: {
        user: req.user._id,
        year: yearNumber,
      },
    },
    {
      $group: {
        _id: "$month",
        monthyExpense: { $sum: { $multiply: ["$quantity", "$unitPrice"] } },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
  ]);
  res.status(200).json({
    status: "success",
    data: stats,
  });
});
