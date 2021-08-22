const accountModel = require('../models/account.models')
const { body, validationResult, check } = require("express-validator");

let dataTokens = {}

module.exports = {
  login: (req, res) => {
    res.render("login", {
      title: "Login",
      layout: "layouts/main",
    });
  },

  register: (req, res) => {
    res.render("register", {
      title: "Register",
      layout: "layouts/main",
    });
  },

  postRegister: async (req, res) => {
    const errors = validationResult(req);
    const { email, firstName, lastName, password, confirmPassword } = req.body;
    const hashedPassword = accountModel.getHashedPassword(password);
    if (!errors.isEmpty()) {
      res.render("register", {
        layout: "layouts/main",
        title: "Register",
        errors: errors.array(),
      });
    } else {
      await accountModel.User.insertMany({ firstName, lastName, email, password: hashedPassword });
      res.render("login", {
        layout: "layouts/main",
        title: "Log In",
        message: "Account successfully created",
        messageClass: "alert-success",
      });
    }
  },

  postLogin: async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = accountModel.getHashedPassword(password);
  
    const user = await accountModel.User.findOne({email : email, password : hashedPassword}) 
  
    if (user) {
      const authToken = await accountModel.generateAuthToken();
      const time = await accountModel.getTime();
      user.time = time;
  
      // Store authentication token
      dataTokens[authToken] = user;
      // authTokens.saveTokens(dataTokens);
  
      // Setting the auth token in cookies
      res.cookie("AuthToken", authToken, { expires: new Date(Date.now() + 900000) });
  
      // Redirect user to the user page
      res.redirect("/user");
    } else {
      res.render("login", {
        layout: "layouts/main",
        title: "Log In",
        message: "Invalid username or password",
        messageClass: "alert-danger",
      });
    }
  },

  logout: (req, res) => {
    const token = req.token;
    delete dataTokens[token];
    res.clearCookie("AuthToken")
    res.redirect("/");
  },

  dataTokens: dataTokens,
}