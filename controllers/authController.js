const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const crypto = require("crypto");
const User = require("./../models/userModel");

const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");
const Email = require("./../utils/email");

exports.signUp = catchAsync(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const url = "https://google.com";
  await new Email(user, url).sendWelcome();
  createSendToken(user, 200, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError("email and password is required"));
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("invalid email or password"));
  }

  createSendToken(user, 200, res);
});

exports.logout = (req, res, next) => {
  const cookiesOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIES_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  if (process.env.NODE_ENV === "production") cookiesOptions.sameSite = "None";
  res.cookie("jwt", "loggedout", cookiesOptions);
  res.status(200).json({ status: "success" });
};

// JWT VERIFICATIONS
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookiesOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIES_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  if (process.env.NODE_ENV === "production") cookiesOptions.sameSite = "None";

  res.cookie("jwt", token, cookiesOptions);
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.protect = catchAsync(async (req, res, next) => {
  let token = "";

  // 1) GETTING TOKEN
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError("you're not logged in from apperror", 400));
  }

  // 2) VERIFICATION OF TOKEN
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("the user belonging to this token does no longer exist", 400)
    );
  }

  // 3) CHECK IF USER CHANGED PASSWORD AFTER THE TOKEN ISSUED
  if (currentUser.changePasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        "user has recently changed password! Please login again",
        400
      )
    );
  }

  // 4) GRANT ACCESS
  req.user = currentUser;
  res.locals.user = currentUser; //This attaches the user to res.locals, which is useful for rendered views
  next();
});

exports.getUserFromJWT = (req, res, next) => {
  res.status(200).json({
    status: "success",
    user: req.user,
  });
};

exports.forgetPassword = catchAsync(async (req, res, next) => {
  // get the user based on the email provided
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("there is no user with this email", 404));
  }

  // generate the random reset token and store it th db
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // send the reset link back to user
  try {
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/resetPassword/${resetToken}`;

    await new Email(user, resetURL).sendResetPassword();
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        "there was an error in sending email. Please try again later!",
        500
      )
    );
  }

  res.status(200).json({
    status: "success",
    message: "Token sent to email!",
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // hash to token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  // update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  // now send the login token
  createSendToken(user, 200, res);
});
