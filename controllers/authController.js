const User = require("./../models/userModel");
exports.signUp = async (req, res) => {
  try {
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    user.password = undefined;

    res.status(200).json({
      status: "success",
      data: user,
    });
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

    user.password = undefined;
    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};
