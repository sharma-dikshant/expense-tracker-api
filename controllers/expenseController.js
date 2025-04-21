const Expense = require("./../models/expenseModel");

exports.getAllExpense = async (req, res) => {
  try {
    // console.log(req.query);
    // if (!req.body.user) req.body.user = "user1";
    //TODO remove the default user
    const user = req.body?.user || "user1";

    console.log(user);
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

    // console.log(month, year);
    // Create boundaries in UTC
    let startDate = new Date(Date.UTC(year, month - 1, 1));
    let endDate = new Date(Date.UTC(year, month, 1));

    if (!req.query.month) {
      startDate = new Date(Date.UTC(year, 0, 1));
      endDate = new Date(Date.UTC(year, 11, 31));
    }

    // console.log("Start Date:", startDate);
    // console.log("End Date:", endDate);

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
    await Expense.create(req.body);
    res.status(200).json({
      status: "success",
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
    // console.log(req.params.id)
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
  // console.log(req.params.id)
  try {
    const newDoc = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({
      status: "success",
      data: newDoc,
    });
  } catch (error) {
    return res.status(404).json({
      status: "fail",
      error,
    });
  }
};

exports.getMonthExpense = async (req, res) => {
  const monthNumber = req.params.month * 1;
  const yearNumber = req.query.year * 1;
  console.log(monthNumber, yearNumber);
  const stats = await Expense.aggregate([
    {
      $addFields: {
        month: { $month: "$date" },
        year: { $year: "$date" },
      },
    },
    {
      $match: {
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
  res.status(200).json({
    status: "success",
  });
};
