const express = require('express');
const router = express.Router();

const experienceRoutes = require('./experienceRoutes');
const bookingRoutes = require('./bookingRoutes');
const promoRoutes = require('./promoRoutes');

// Mount routes
router.use('/experiences', experienceRoutes);
router.use('/bookings', bookingRoutes);
router.use('/promo', promoRoutes);

// Health check route
router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'BookIt API is running',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;