const { PromoCode } = require('../models');

// Validate promo code
exports.validatePromoCode = async (req, res) => {
    try {
        const { code, amount } = req.body;

        if (!code || amount === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Promo code and amount are required'
            });
        }

        const promo = await PromoCode.findOne({
            where: {
                code: code.toUpperCase(),
                is_active: true
            }
        });

        if (!promo) {
            return res.status(404).json({
                success: false,
                message: 'Invalid promo code'
            });
        }

        const now = new Date();

        // Check if promo is within valid date range
        if (now < promo.valid_from || now > promo.valid_until) {
            return res.status(400).json({
                success: false,
                message: 'Promo code has expired'
            });
        }

        // Check usage limit
        if (promo.usage_limit && promo.used_count >= promo.usage_limit) {
            return res.status(400).json({
                success: false,
                message: 'Promo code usage limit reached'
            });
        }

        // Check minimum purchase amount
        if (amount < promo.min_purchase_amount) {
            return res.status(400).json({
                success: false,
                message: `Minimum purchase amount of $${promo.min_purchase_amount} required`,
                min_amount: promo.min_purchase_amount
            });
        }

        // Calculate discount
        let discountAmount = 0;

        if (promo.discount_type === 'percentage') {
            discountAmount = (amount * promo.discount_value) / 100;
            if (promo.max_discount_amount) {
                discountAmount = Math.min(discountAmount, parseFloat(promo.max_discount_amount));
            }
        } else if (promo.discount_type === 'fixed') {
            discountAmount = parseFloat(promo.discount_value);
        }

        const finalAmount = amount - discountAmount;

        res.status(200).json({
            success: true,
            message: 'Promo code applied successfully',
            data: {
                code: promo.code,
                description: promo.description,
                discount_type: promo.discount_type,
                discount_value: promo.discount_value,
                discount_amount: parseFloat(discountAmount.toFixed(2)),
                original_amount: parseFloat(amount.toFixed(2)),
                final_amount: parseFloat(finalAmount.toFixed(2))
            }
        });

    } catch (error) {
        console.error('Error validating promo code:', error);
        res.status(500).json({
            success: false,
            message: 'Error validating promo code',
            error: error.message
        });
    }
};

// Get all active promo codes (for testing/admin purposes)
exports.getAllPromoCodes = async (req, res) => {
    try {
        const promoCodes = await PromoCode.findAll({
            where: { is_active: true },
            attributes: ['code', 'description', 'discount_type', 'discount_value', 'min_purchase_amount', 'valid_from', 'valid_until']
        });

        res.status(200).json({
            success: true,
            count: promoCodes.length,
            data: promoCodes
        });
    } catch (error) {
        console.error('Error fetching promo codes:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching promo codes',
            error: error.message
        });
    }
};