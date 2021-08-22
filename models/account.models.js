require('../config/db')
const mongoose = require('mongoose')

const User = mongoose.model('User', {
  firstName: {
    type : String,
    required: true,
  },
  lastName : {
    type : String,
    required: true,
  },
  email : {
    type : String,
    required: true,
  }, 
  password : {
    type: String,
    required : true
  }
})

const { body, validationResult, check } = require("express-validator");

const crypto = require("crypto");
const getHashedPassword = (password) => {
  const sha256 = crypto.createHash("sha256");
  const hash = sha256.update(password).digest("base64");
  return hash;
};

const registerValidator = [
  check("email", "Email is not valid").isEmail(),
  body("email").custom(async (value) => {
    const duplicate = await User.findOne({email : value});
    if (duplicate) {
      throw new Error("Email is already exist!");
    }
    return true;
  }),
  check("password", "Password at least 8 characters in length.").isLength({ min: 8 }),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password confirmation does not match password");
    }
    return true;
  }),
]

const generateAuthToken = () => {
  return crypto.randomBytes(30).toString("hex");
};

const getTime = function () {
  const date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth();
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var seconds = date.getSeconds();
  var timeNow = `${year}-${month}-${day} ${hour}:${minute}:${seconds}`;
  return timeNow;
};

module.exports = {
  getHashedPassword: getHashedPassword,
  User: User,
  registerValidator: registerValidator,
  generateAuthToken: generateAuthToken,
  getTime: getTime
}