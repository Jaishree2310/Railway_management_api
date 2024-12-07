const express = require('express');
const BookingController = require('../controllers/bookingController');
const { authenticateUser } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/book', authenticateUser, BookingController.bookSeat);
router.get('/details', authenticateUser, BookingController.getBookingDetails);

module.exports = router;