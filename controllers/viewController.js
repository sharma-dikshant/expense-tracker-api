exports.getLandingPage = (req, res, next) => {
  res.status(200).render("landingPage");
};

exports.getForgetPassword = (req, res, next) => {
  res.status(200).render("passwordResetForm");
}
