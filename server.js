const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config({ path: "./config.env" });
const app = require("./app");

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

const port = 3000;
app.listen(port, () => {
  console.log("server is connected !");
});
