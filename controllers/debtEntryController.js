const DebtEntry = require("./../models/debtEntry");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const ApiResponse = require("./../utils/ApiResponse");

exports.createDebtEntry = catchAsync(async (req, res, next) => {
  const newDoc = await DebtEntry.create({ ...req.body, user: req.user._id });
  return new ApiResponse(200, "success", newDoc).send(res);
});

exports.updateDebtEntry = catchAsync(async (req, res, next) => {
  const newDoc = await DebtEntry.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    {
      runValidators: true,
      new: true,
    }
  );
  return new ApiResponse(200, "success", newDoc).send(res);
});

exports.softDeleteDebtEntry = catchAsync(async (req, res, next) => {
  const doc = await DebtEntry.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { active: false },
    { new: true }
  );
  return new ApiResponse(204, "success", null).send(res);
});

exports.getAllDebtEntryOfLoggedInUser = catchAsync(async (req, res, next) => {
  console.log("fdg");
  const docs = await DebtEntry.find({ user: req.user._id }).exec();
  console.log("found")
  return new ApiResponse(200, "success", docs).send(res);
});
