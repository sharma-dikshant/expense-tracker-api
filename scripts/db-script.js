const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config({ path: "./config.env" });
const app = require("./../app");
const Expense = require("./../models/expenseModel");

const DB = process.env.DATABASE_URL.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    //options
  })
  .then((con) => {
    console.log("DB connected! ");
  });

const emptyCollection = async () => {
  try {
    await Expense.deleteMany();
    console.log("Empty SuccessFully!");
  } catch (error) {
    console.log("error emptying!", error);
  } finally {
    process.exit(1);
  }
};

if (process.argv[2] === "--delete") {
  emptyCollection();
} else {
    console.log("enter valid argument");
    process.exit(1);
}

const port = 3000;
app.listen(port, () => {
  console.log("server is connected !");
});
