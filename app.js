const express = require("express");
const app = express();

const expenseRouter = require("./routes/expenseRouter");

app.use("/api/expenses", expenseRouter);

module.exports = app;
