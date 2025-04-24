const Expense = require("./../models/expenseModel");

exports.getAllExpense = async (req, res) => {
  try {
    const user = req?.user._id;
    if (!user) throw Error("no user logged in!");
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
  } catch (err) {
    return res.status(404).json({
      status: "failed",
      error: err,
    });
  }
};

exports.createExpense = async (req, res) => {
  try {
    const newDoc = await Expense.create({ ...req.body, user: req.user._id });
    res.status(200).json({
      status: "success",
      data: newDoc,
    });
  } catch (err) {
    return res.status(404).json({
      status: "failed",
      error: err,
    });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.status(202).json({
      status: "success",
    });
  } catch (error) {
    return res.status(404).json({
      status: "fail",
      error,
    });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const newDoc = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: newDoc,
    });
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};

exports.getMonthExpense = async (req, res) => {
  const monthNumber = req.params.month * 1;
  const yearNumber = req.query.year * 1;
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
};

exports.getYearExpense = async (req, res) => {
  const yearNumber = req.params.year * 1;
  try {
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
  } catch (error) {
    return res.status(400).json({
      status: "error",
      error,
    });
  }
};
