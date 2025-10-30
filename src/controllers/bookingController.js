const { Booking, User, Experience, Slot, PromoCode } = require('../models');
const { sequelize } = require('../config/database');
const { generateBookingReference } = require('../utils/helpers');

// Create a new booking
exports.createBooking = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const {
            name,
            email,
            phone,
            experience_id,
            slot_id,
            number_of_people,
            promo_code,
            special_requests
        } = req.body;

        // Validation
        if (!name || !email || !phone || !experience_id || !slot_id || !number_of_people) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }

        // Check if experience exists
        const experience = await Experience.findByPk(experience_id);
        if (!experience || !experience.is_active) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: 'Experience not found or not available'
            });
        }

        // Check if slot exists and has capacity
        const slot = await Slot.findByPk(slot_id, { transaction });
        if (!slot || slot.experience_id !== experience_id) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: 'Slot not found'
            });
        }

        if (!slot.is_available || slot.available_spots < number_of_people) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: 'Insufficient capacity for selected slot'
            });
        }

        // Check if slot is in the past (comparing with current time)
        const slotStartTime = new Date(slot.start_time);
        if (slotStartTime < new Date()) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: 'Cannot book past slots'
            });
        }

        // Create or find user
        let user = await User.findOne({ where: { email } });
        if (!user) {
            user = await User.create({ name, email, phone }, { transaction });
        }

        // Calculate pricing
        const basePrice = parseFloat(experience.price) * number_of_people;
        let discountAmount = 0;
        let appliedPromoCode = null;

        // Apply promo code if provided
        if (promo_code) {
            const promo = await PromoCode.findOne({
                where: {
                    code: promo_code.toUpperCase(),
                    is_active: true
                }
            });

            if (promo) {
                const now = new Date();

                // Check if promo is valid
                if (now >= promo.valid_from && now <= promo.valid_until) {
                    // Check usage limit
                    if (!promo.usage_limit || promo.used_count < promo.usage_limit) {
                        // Check minimum purchase amount
                        if (basePrice >= promo.min_purchase_amount) {
                            // Calculate discount
                            if (promo.discount_type === 'percentage') {
                                discountAmount = (basePrice * promo.discount_value) / 100;
                                if (promo.max_discount_amount) {
                                    discountAmount = Math.min(discountAmount, parseFloat(promo.max_discount_amount));
                                }
                            } else if (promo.discount_type === 'fixed') {
                                discountAmount = parseFloat(promo.discount_value);
                            }

                            appliedPromoCode = promo_code.toUpperCase();

                            // Increment usage count
                            await promo.increment('used_count', { transaction });
                        }
                    }
                }
            }
        }

        const totalPrice = basePrice - discountAmount;

        // Generate unique booking reference
        const bookingReference = generateBookingReference();

        // Create booking
        const booking = await Booking.create({
            user_id: user.id,
            experience_id: experience_id,
            slot_id: slot_id,
            booking_reference: bookingReference,
            number_of_people,
            base_price: basePrice,
            discount_amount: discountAmount,
            total_price: totalPrice,
            promo_code: appliedPromoCode,
            status: 'confirmed',
            special_requests
        }, { transaction });

        // Update slot capacity
        await slot.decrement('available_spots', {
            by: number_of_people,
            transaction
        });

        // Update slot availability if fully booked
        if (slot.available_spots - number_of_people <= 0) {
            await slot.update({ is_available: false }, { transaction });
        }

        await transaction.commit();

        // Fetch complete booking details
        const completeBooking = await Booking.findByPk(booking.id, {
            include: [
                {
                    model: Experience,
                    as: 'experience',
                    attributes: ['id', 'title', 'location', 'duration', 'image_url']
                },
                {
                    model: Slot,
                    as: 'slot',
                    attributes: ['start_time', 'end_time']
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['name', 'email', 'phone']
                }
            ]
        });

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: completeBooking
        });

    } catch (error) {
        // Only rollback if the transaction is still active
        if (transaction.finished !== 'commit' && transaction.finished !== 'rollback') {
            await transaction.rollback();
        }
        console.error('Error creating booking:', error);

        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                success: false,
                message: 'Booking reference conflict. Please try again.'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error creating booking',
            error: error.message
        });
    }
};

// Get booking by reference
exports.getBookingByReference = async (req, res) => {
    try {
        const { reference } = req.params;

        const booking = await Booking.findOne({
            where: { booking_reference: reference },
            include: [
                {
                    model: Experience,
                    as: 'experience',
                    attributes: ['id', 'title', 'location', 'duration', 'image_url', 'category']
                },
                {
                    model: Slot,
                    as: 'slot',
                    attributes: ['start_time', 'end_time']
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['name', 'email', 'phone']
                }
            ]
        });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (error) {
        console.error('Error fetching booking:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching booking',
            error: error.message
        });
    }
};

// Get all bookings for a user (by email)
exports.getUserBookings = async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const bookings = await Booking.findAll({
            where: { user_id: user.id },
            include: [
                {
                    model: Experience,
                    as: 'experience',
                    attributes: ['id', 'title', 'location', 'duration', 'image_url']
                },
                {
                    model: Slot,
                    as: 'slot',
                    attributes: ['start_time', 'end_time']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        console.error('Error fetching user bookings:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching bookings',
            error: error.message
        });
    }
};