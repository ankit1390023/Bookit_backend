const express = require('express');
const router = express.Router();
const promoController = require('../controllers/promoController');

// @route   POST /api/promo/validate
// @desc    Validate a promo code
// @access  Public
router.post('/validate', promoController.validatePromoCode);

// @route   GET /api/promo
// @desc    Get all active promo codes
// @access  Public (in production, this should be protected)
router.get('/', promoController.getAllPromoCodes);

module.exports = router;