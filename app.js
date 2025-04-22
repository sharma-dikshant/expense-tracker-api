const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const expenseRouter = require("./routes/expenseRouter");
const app = express();

//global middleware
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

//Routes
app.use("/api/expenses", expenseRouter);

module.exports = app;
