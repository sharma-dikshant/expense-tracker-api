const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const expenseRouter = require("./routes/expenseRouter");
const userRouter = require("./routes/userRouter");
const errorController = require("./controllers/errorController");
const app = express();

//global middleware
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const allowedOrigins = [
  "https://unique-manatee-2c9d2b.netlify.app",
  "http://127.0.0.1:4000",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

//Routes
app.use("/api/expenses", expenseRouter);
app.use("/api/users", userRouter);

app.use("/", (req, res) => {
  res.status(200).send("welcome!");
});

app.use(errorController);

module.exports = app;
