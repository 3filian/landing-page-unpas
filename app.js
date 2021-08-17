// Local module
const users = require("./utils/users");
const authTokens = require('./utils/auth-tokens')

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

const crypto = require("crypto");
const getHashedPassword = (password) => {
  const sha256 = crypto.createHash("sha256");
  const hash = sha256.update(password).digest("base64");
  return hash;
};

app.post(
  "/register",
  // Express validator
  [
    check("email", "Email is not valid").isEmail(),
    body("email").custom((value) => {
      const duplicate = users.checkDuplicate(value);
      if (duplicate) {
        throw new Error("Email is already exist!");
      }
      return true;
    }),
    check("password", "Password at least 8 characters in length.").isLength({ min: 8 }),
    // check("confirmPassword", "Password at least 8 characters in length.").isLength({ min: 8 }),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
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
      users.addUser({ firstName, lastName, email, password: hashedPassword });
      res.render("login", {
        layout: "layouts/main",
        title: "Log In",
        message: "Account successfully created",
        messageClass: "alert-success",
      });
    }
  }
);

const generateAuthToken = () => {
  return crypto.randomBytes(30).toString("hex");
};


// This will hold the users and authToken related to users
// const dataTokens = authTokens.loadFile();
const dataTokens = {};

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = getHashedPassword(password);
  const file = users.loadFile();

  const user = file.find((user) => {
    return user.email === email && hashedPassword === user.password;
  });

  if (user) {
    const authToken = generateAuthToken();
    const time = authTokens.getTime();
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
});

app.use((req, res, next) => {
  // Get auth token from the cookies
  const authToken = req.cookies["AuthToken"];

  // Inject the user to the request
  req.user = dataTokens[authToken];
  req.token = authToken;

  next();
});

app.get("/user", (req, res) => {
  if (req.user) {
    const dataUser = req.user;
    res.setHeader("Content-Type", "text/html");
    res.render("index", {
      user: req.user,
      token: req.token,
      tokens: dataTokens,
      layout: "layouts/main",
      title: "Home User",
    });
    // console.log(req.user);
  } else {
    res.render("login", {
      layout: "layouts/main",
      title: "Log In",
      message: "Please login to continue",
      messageClass: "alert-danger",
    });
  }
});

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

app.get("/user", requireAuth, (req, res) => {
  res.render("index", {
    layout: "layouts/main",
    title: "Home User",
  });
});

app.get("/logout", (req, res) => {
  const token = req.token;
  delete dataTokens[token];
  res.redirect("/");
});

app.listen(port, () => console.log(`Listening from port ${port}`));
