const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, '../users.json');

class User {
  constructor(email, password) {
    this.email = email;
    this.password = password;
  }

  static getAllUsers() {
    if (!fs.existsSync(usersFilePath)) {
      fs.writeFileSync(usersFilePath, JSON.stringify([]));
    }
    return JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));
  }

  static getUserByEmail(email) {
    const users = this.getAllUsers();
    return users.find(user => user.email === email);
  }

  static addUser(newUser) {
    const users = this.getAllUsers();
    users.push(newUser);
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
  }

  static updateUser(email, updatedUser) {
    let users = this.getAllUsers();
    users = users.map(user => (user.email === email ? { ...user, ...updatedUser } : user));
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
  }

  static deleteUser(email) {
    let users = this.getAllUsers();
    users = users.filter(user => user.email !== email);
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
  }
}

module.exports = User;
