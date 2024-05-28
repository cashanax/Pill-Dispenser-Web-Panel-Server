const fs = require('fs');

function writeJSONFile(filename, data) {
  fs.writeFileSync(filename, JSON.stringify(data, null, 2), 'utf8');
}

function readJSONFile(filename) {
  try {
    return JSON.parse(fs.readFileSync(filename, 'utf8'));
  } catch (err) {
    return "no json file";
  }
}

function readUsers() {
  const usersFilePath = 'users.json';
  if (!fs.existsSync(usersFilePath)) {
      fs.writeFileSync(usersFilePath, JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));
}

function writeUsers(users) {
  const usersFilePath = 'users.json';
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

function getUserByEmail(email) {
  const users = readUsers();
  return users.find(user => user.email === email);
}

function addUser(user) {
  const users = readUsers();
  users.push(user);
  writeUsers(users);
}

module.exports = { writeJSONFile, readJSONFile, getUserByEmail, addUser };
