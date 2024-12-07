const mysql = require('mysql2/promise');
const { DB_CONFIG } = require('../config/database');

class TrainModel {
  static async create(name, source, destination, totalSeats) {
    const connection = await mysql.createConnection(DB_CONFIG);
    const [result] = await connection.execute(
      'INSERT INTO trains (name, source, destination, total_seats, available_seats) VALUES (?, ?, ?, ?, ?)',
      [name, source, destination, totalSeats, totalSeats]
    );
    await connection.end();
    return result.insertId;
  }

  static async findByRoute(source, destination) {
    const connection = await mysql.createConnection(DB_CONFIG);
    const [rows] = await connection.execute(
      'SELECT * FROM trains WHERE source = ? AND destination = ?',
      [source, destination]
    );
    await connection.end();
    return rows;
  }
}

module.exports = TrainModel;