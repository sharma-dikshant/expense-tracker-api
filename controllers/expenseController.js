exports.getAllExpense = (req, res) => {
  res.status(200).json({
    status: "success",
    data: "all expenses",
  });
};
