// models/userModel.js
const mysql = require('mysql2/promise');
const { DB_CONFIG } = require('../config/database');

class UserModel {
  static async create(username, email, password) {
    const connection = await mysql.createConnection(DB_CONFIG);
    const [result] = await connection.execute(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, password]
    );
    await connection.end();
    return result.insertId;
  }

  static async findByEmail(email) {
    const connection = await mysql.createConnection(DB_CONFIG);
    const [rows] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    await connection.end();
    return rows[0];
  }
}

module.exports = UserModel;