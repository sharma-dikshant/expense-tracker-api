const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config({ path: "./config.env" });
const app = require("./app");
const jobs = require("./cron/jobs");
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
    // start recurring expense jobs
    jobs.startReccuringExpenseJob();
  });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server is running on ${port}`);
});

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("UNCAUGHT EXCEPTION! 💥 shutting down....");
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNCAUGHT REJECTION! 💥 shutting down....");
  process.exit(1);
});
