const requireAuth = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.render("login", {
      layout: "layouts/main",
      title: "Log In",
      message: "Please login to continue",
      messageClass: "alert-danger",
    });
  }
};

module.exports = {requireAuth}