// Local module
const users = require("./utils/users");

// Express
const express = require("express");
const app = express();
const port = 4000;

// Third-party module
const expressLayouts = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");
const { body, validationResult, check } = require("express-validator");

// To make public folder
app.use(express.static("public"));

app.use(cors());

// To support URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// To parse cookies from the HTTP Request
app.use(cookieParser());

// EJS
app.set("view engine", "ejs");
app.use(expressLayouts);

app.get("/", (req, res) => {
  res.render("index", {
    layout: "layouts/main",
    title: "Home",
  });
});

app.get("/login", (req, res) => {
  res.render("login", {
    title: "Login",
    layout: "layouts/main",
  });
});

app.get("/register", (req, res) => {
  res.render("register", {
    title: "Register",
    layout: "layouts/main",
  });
});

const getHashedPassword = (password) => {
  const sha256 = crypto.createHash("sha256");
  const hash = sha256.update(password).digest("base64");
  return hash;
};

app.post(
  "/register",
  [
    check("email", "Email is not valid!").isEmail(),
    body("email").custom((value) => {
      const duplicate = users.checkDuplicate(value);
      if (duplicate) {
        throw new Error("Email is already exist!");
      }
      return true;
    }),
    check("password", "Password at least 8 characters in length.").isLength({ min: 8 }),
    body("confirmPassword").custom((value) => {
      if (value != req.body.password) {
        throw new Error("Password confirmation does not match password");
      }
      return true;
    }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    const { email, firstName, lastName, password, confirmPassword } = req.body;
    const hashedPassword = getHashedPassword(password);
    if (!errors.isEmpty()) {
      res.render("register", {
        layout: "layouts/main",
        title: "Register",
        errors: errors.array(),
      });
    } else {
      users.addUser({ email, firstName, lastName, password: hashedPassword });
      res.render("login", {
        layout: "layouts/main",
        title: "Log In",
        message: "Account successfully created",
        messageClass: "alert-success",
      });
    }
  }
);

app.listen(port, () => console.log(`Listening from port ${port}`));
