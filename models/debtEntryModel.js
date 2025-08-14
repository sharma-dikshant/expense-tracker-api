const mongoose = require("mongoose");

const debtEntrySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["borrow", "lent"],
    required: [true, "please specific type"],
  },
  amount: {
    type: Number,
    required: [true, "please specify amount"],
    min: [0, "amount should be greater than 0"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "debt entry must belong to an user"],
  },
  to: {
    type: String,
    required: [true, "please specify second person"],
  },
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "settled"],
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  settledAt: {
    type: Date,
  },
  note: String,
  active: {
    type: Boolean,
    default: true,
  },
});

debtEntrySchema.pre(/^find/, function (next) {
  this.where({ active: { $ne: false } });
  next();
});

const debtEntry = mongoose.model("DebtEntry", debtEntrySchema);

module.exports = debtEntry;
