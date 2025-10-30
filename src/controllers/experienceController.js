const { Experience, Slot } = require('../models/index');
const { Op } = require('sequelize');

// Get all experiences with filters
exports.getAllExperiences = async (req, res) => {
    try {
        const { category, location, minPrice, maxPrice, search } = req.query;

        let whereClause = { is_active: true };

        // Apply filters
        if (category) {
            whereClause.category = category;
        }

        if (location) {
            whereClause.location = {
                [Op.like]: `%${location}%`
            };
        }

        if (minPrice || maxPrice) {
            whereClause.price = {};
            if (minPrice) whereClause.price[Op.gte] = parseFloat(minPrice);
            if (maxPrice) whereClause.price[Op.lte] = parseFloat(maxPrice);
        }

        if (search) {
            whereClause[Op.or] = [
                { title: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } },
                { location: { [Op.like]: `%${search}%` } }
            ];
        }

        const experiences = await Experience.findAll({
            where: whereClause,
            order: [['rating', 'DESC'], ['reviews_count', 'DESC']]
        });

        res.status(200).json({
            success: true,
            count: experiences.length,
            data: experiences
        });
    } catch (error) {
        console.error('Error fetching experiences:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching experiences',
            error: error.message
        });
    }
};

// Get single experience by ID with available slots
exports.getExperienceById = async (req, res) => {
    try {
        const { id } = req.params;
        const { date } = req.query;

        const experience = await Experience.findByPk(id);

        if (!experience) {
            return res.status(404).json({
                success: false,
                message: 'Experience not found'
            });
        }

        // Build slot query
        let slotWhereClause = {
            experience_id: id,
            is_available: true,
            available_spots: { [Op.gt]: 0 }
        };

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Filter by date if provided
        if (date) {
            const startOfDay = new Date(date);
            const endOfDay = new Date(date);
            endOfDay.setDate(endOfDay.getDate() + 1);

            slotWhereClause.start_time = {
                [Op.gte]: startOfDay,
                [Op.lt]: endOfDay
            };
        } else {
            // Get slots from now onwards
            slotWhereClause.start_time = { [Op.gte]: today };
        }

        const slots = await Slot.findAll({
            where: slotWhereClause,
            order: [['start_time', 'ASC']],
            limit: 30 // Limit to next 30 slots
        });

        // Group slots by date
        const slotsByDate = slots.reduce((acc, slot) => {
            const dateKey = slot.start_time.toISOString().split('T')[0];
            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }
            const timeString = slot.start_time.toTimeString().substring(0, 5);
            acc[dateKey].push({
                id: slot.id,
                time: timeString,
                start_time: slot.start_time,
                end_time: slot.end_time,
                available_spots: slot.available_spots,
                max_capacity: slot.max_capacity,
                is_available: slot.is_available
            });
            return acc;
        }, {});

        res.status(200).json({
            success: true,
            data: {
                experience,
                availableSlots: slotsByDate
            }
        });
    } catch (error) {
        console.error('Error fetching experience:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching experience details',
            error: error.message
        });
    }
};

