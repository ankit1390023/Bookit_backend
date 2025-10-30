const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Public
router.post('/', bookingController.createBooking);

// @route   GET /api/bookings/reference/:reference
// @desc    Get booking by reference number
// @access  Public
router.get('/reference/:reference', bookingController.getBookingByReference);

// @route   GET /api/bookings/user
// @desc    Get all bookings for a user by email
// @access  Public
router.get('/user', bookingController.getUserBookings);

module.exports = router;