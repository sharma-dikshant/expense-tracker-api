const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("./../models/userModel");
exports.signUp = async (req, res) => {
  try {
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    createSendToken(user, 200, res);
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) throw Error("email and password is required");
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      throw Error("invalid email or password");
    }

    // res.status(200).json({
    //   status: "success",
    //   data: user,
    // });
    createSendToken(user, 200, res);
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
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
    // secure: true,
  };

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

exports.protect = async (req, res, next) => {
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
    return res.status(400).json({
      status: "fail",
      error: "you're not logged in! Please Login to get access",
    });
  }

  // 2) VERIFICATION OF TOKEN
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return res.status(400).json({
      status: "fail",
      error: "the user belonging to this token does no longer exist",
    });
  }

  // 3) CHECK IF USER CHANGED PASSWORD AFTER THE TOKEN ISSUED
  if (currentUser.changePasswordAfter(decoded.iat)) {
    return res.status(400).json({
      status: "fail",
      error: "user has recently changed password! Please login again",
    });
  }

  // 4) GRANT ACCESS
  req.user = currentUser;
  res.locals.user = currentUser; //This attaches the user to res.locals, which is useful for rendered views
  next();
};
