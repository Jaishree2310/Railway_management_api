const mysql = require('mysql2/promise');
const { DB_CONFIG } = require('../config/database');

class BookingModel {
  static async bookSeat(userId, trainId) {
    const connection = await mysql.createConnection(DB_CONFIG);
    
    try {
      // Start transaction for race condition handling
      await connection.beginTransaction();

      const [trainRows] = await connection.execute(
        'SELECT available_seats FROM trains WHERE id = ? FOR UPDATE',
        [trainId]
      );

      const availableSeats = trainRows[0].available_seats;

      if (availableSeats <= 0) {
        await connection.rollback();
        return null;
      }

      // Reduce available seats
      await connection.execute(
        'UPDATE trains SET available_seats = available_seats - 1 WHERE id = ?',
        [trainId]
      );

      // Create booking
      const [bookingResult] = await connection.execute(
        'INSERT INTO bookings (user_id, train_id) VALUES (?, ?)',
        [userId, trainId]
      );

      // Commit transaction
      await connection.commit();

      return bookingResult.insertId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      await connection.end();
    }
  }

  static async getBookingDetails(userId) {
    const connection = await mysql.createConnection(DB_CONFIG);
    const [rows] = await connection.execute(
      `SELECT b.id, t.name, t.source, t.destination 
       FROM bookings b 
       JOIN trains t ON b.train_id = t.id 
       WHERE b.user_id = ?`,
      [userId]
    );
    await connection.end();
    return rows;
  }
}

module.exports = BookingModel;
