const mongoose = require("mongoose");
const AppError = require("./../utils/appError");

const budgetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required"],
    unique: true,
    lowercase: true,
  },
  limit: {
    type: Number,
    required: [true, "limit is required"],
    min: [1, "limit should be greater than 1"],
  },
  spend: {
    type: Number,
    default: 0,
  },
  category: String,
  period: {
    type: String,
    required: [true, "budget period is required"],
    enum: ["monthly", "yearly"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "budget must belong to a user"],
  },
});

budgetSchema.pre("findOneAndUpdate", async function (next) {
  const updates = this.getUpdate();
  if (!updates.add) return next();

  const doc = await this.model.findOne(this.getQuery());
  if (Number(doc.spend) + Number(updates.add) > Number(doc.limit)) {
    return next(new AppError("Limit exceed", 400));
  }

  doc.spend += Number(updates.add);
  await doc.save();
  next();
});

const budgetModel = mongoose.model("Budget", budgetSchema);
module.exports = budgetModel;
