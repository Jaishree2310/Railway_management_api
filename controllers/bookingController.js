const BookingModel = require('../models/bookingModel');

class BookingController {
  static async bookSeat(req, res) {
    try {
      const { trainId } = req.body;
      const userId = req.user.id;
      
      const bookingId = await BookingModel.bookSeat(userId, trainId);
      
      if (!bookingId) {
        return res.status(400).json({ error: 'No seats available' });
      }
      
      res.status(201).json({ 
        message: 'Seat booked successfully', 
        bookingId 
      });
    } catch (error) {
      res.status(500).json({ error: 'Booking failed' });
    }
  }

  static async getBookingDetails(req, res) {
    try {
      const userId = req.user.id;
      
      const bookings = await BookingModel.getBookingDetails(userId);
      
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve bookings' });
    }
  }
}

module.exports = BookingController;