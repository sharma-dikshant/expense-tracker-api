const fs = require("fs");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config({ path: "./config.env" });
const Expense = require("./models/expenseModel");

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

const expenses = JSON.parse(fs.readFileSync(`${__dirname}/data/dev-data.json`, "utf-8"));

const deleteData = async () => {
  try {
    await Expense.deleteMany();
    console.log("Data deleted successfully!");
  } catch (error) {
    console.log("Failed to Delete data 😵‍💫");
  } finally {
    process.exit(1);
  }
};
const importData = async () => {
  try {
    await Expense.create(expenses);
    console.log("Data loaded successfully!");
  } catch (error) {
    console.log("Failed to Load data 😵‍💫", error);
  } finally {
    process.exit(1);
  }
};

console.log(process.argv);

if (process.argv[2] === "--import") {
    importData();
} else if (process.argv[2] === "--delete") {
    deleteData();
} else {
    console.log("ERR: please provide valid argument💥");
    process.exit(1);
}
