const fs = require("fs");

// Create folder data
const folderPath = "./data";
if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath);
}

// Create file users.json to save users account
const filePath = "./data/users.json";
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, "[]");
}

// load file
const loadFile = function () {
  const file = fs.readFileSync(filePath, "utf8");
  return JSON.parse(file);
};

// save file
const saveUsers = function (users) {
  fs.writeFileSync(filePath, JSON.stringify(users));
};

// Check email exist
const checkDuplicate = (email) => {
  const users = loadFile();
  return users.find((user) => user.email === email);
};

// add user
const addUser = (user) => {
  const users = loadFile();
  users.push(user);
  saveUsers(users);
};

module.exports = {
  loadFile: loadFile,
  checkDuplicate: checkDuplicate,
  addUser: addUser,
};
