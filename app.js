const express = require("express");
const cors = require('cors');

const expenseRouter = require("./routes/expenseRouter");
const app = express();

app.use(cors());

//global middleware
app.use(express.json());

//Routes
app.use("/api/expenses", expenseRouter);

module.exports = app;
