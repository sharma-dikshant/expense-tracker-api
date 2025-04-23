const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "user name is required"],
    minLength: [3, "min 3 character name is required"],
    lowercase: true,
  },
  email: {
    type: String,
    unique: true,
    required: [true, "email is required"],
    lowercase: true,
    validate: [validator.isEmail, "provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
    minLength: [8, "min 8 character password is required"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "please confirm password"],
    minLength: [8, "min 8 character password is required"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "passwords are not same",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

//INSTANCE METHODS FOR USER VERIFICATION
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

//TODO instance method to verify password changed

userSchema.methods.changePasswordAfter = function (JWTTimpstamp) {
  if (this.passwordChangedAt) {
    const changeTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimpstamp < changeTimestamp;
  }

  return false;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
