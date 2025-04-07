const express = require("express");

const expenseRouter = require("./routes/expenseRouter");
const app = express();

//global middleware
app.use(express.json());

//Routes
app.use("/api/expenses", expenseRouter);

module.exports = app;
