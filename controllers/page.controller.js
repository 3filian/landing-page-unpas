const accountController = require('./account.controller')
let dataTokens = accountController.dataTokens

module.exports = {
  index: (req, res) => {
    res.render("index", {
      layout: "layouts/main",
      title: "Home",
    });
  },

  user: (req, res) => {
    if (req.user) {
      res.setHeader("Content-Type", "text/html");
      res.render("index", {
        user: req.user,
        layout: "layouts/main",
        title: "Home User",
      });
    } else {
      res.render("login", {
        layout: "layouts/main",
        title: "Log In",
        message: "Please login to continue",
        messageClass: "alert-danger",
      });
    }
  },

  middleware: (req, res, next) => {
    // Get auth token from the cookies
    const authToken = req.cookies["AuthToken"];
  
    // Inject the user to the request
    req.user = dataTokens[authToken];
    req.token = authToken;
  
    next();
  },
}