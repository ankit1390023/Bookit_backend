const { sequelize } = require('../config/database');
const { Experience, Slot, PromoCode } = require('../models');

const experiences = [
    {
        title: 'Desert Safari',
        description: 'Experience the thrill of dune bashing, camel riding, and traditional Bedouin camp with BBQ dinner under the stars.',
        location: 'Dubai Desert, UAE',
        price: 7500, // Approximately 89.99 USD in INR
        duration: '6 hours',
        category: 'Adventure',
        image_url: 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=800',
        rating: 4.8,
        reviews_count: 342,
        highlights: [
            'Dune bashing in 4x4 vehicle',
            'Camel riding experience',
            'Traditional BBQ dinner',
            'Henna painting',
            'Belly dance show'
        ],
        included: [
            'Hotel pickup and drop-off',
            'BBQ dinner with unlimited soft drinks',
            'All activities mentioned',
            'Professional guide'
        ],
        not_included: [
            'Alcoholic beverages',
            'Personal expenses',
            'Quad biking (available at extra cost)'
        ]
    },
    {
        title: 'Aurora tour',
        description: 'Chase the magical Aurora Borealis in the Arctic wilderness.',
        location: 'Tromsø, Norway',
        price: 12500, // Approximately 149.99 USD in INR
        duration: '8 hours',
        category: 'Nature',
        image_url: 'https://images.unsplash.com/photo-1579033461380-adb47c3eb938?w=800',
        rating: 4.9,
        reviews_count: 567,
        highlights: [
            'Professional Aurora guide',
            'Small group (max 8 people)',
            'Photography assistance',
            'Warm thermal suits provided',
            'Hot chocolate and snacks'
        ],
        included: [
            'Hotel pickup and drop-off',
            'Thermal suits and boots',
            'Hot drinks and snacks',
            'Professional photographer guide'
        ],
        not_included: [
            'Personal camera equipment',
            'Additional meals',
            'Gratuities'
        ]
    },
    {
        title: 'Boat tour',
        description: 'Explore the stunning coastline of Croatia with a professional guide.',
        location: 'Split, Croatia',
        price: 10800, // Approximately 129.99 USD in INR
        duration: '4 hours',
        category: 'Adventure',
        image_url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800',
        rating: 4.7,
        reviews_count: 289,
        highlights: [
            'Boat tour with professional guide',
            'Traditional Croatian lunch',
            'Wine tasting included',
            'Explore stunning coastline',
            'Professional guide'
        ],
        included: [
            'Hotel pickup and drop-off',
            'Traditional Croatian lunch',
            'Wine tasting',
            'Explore stunning coastline',
            'Professional guide'
        ],
        not_included: [
            'Hotel transfers',
            'Additional beverages',
            'Gratuities'
        ]
    },
    {
        title: 'Scuba Diving',
        description: 'Explore the world\'s largest coral reef system with certified instructors.',
        location: 'Cairns, Australia',
        price: 16700, // Approximately 199.99 USD in INR
        duration: 'Full day',
        category: 'Adventure',
        image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
        rating: 4.9,
        reviews_count: 891,
        highlights: [
            'Scuba diving with professional instructor',
            'All equipment included',
            'Certified instructors',
            'Underwater photography',
            'Marine life guarantee'
        ],
        included: [
            'Hotel pickup and drop-off',
            'All diving equipment',
            'Guided dives',
            'Lunch and snacks',
            'Wetsuit and fins'
        ],
        not_included: [
            'Dive computer rental',
            'Underwater camera',
            'Optional third dive',
            'Medical certificate (if required)'
        ]
    },
    {
        title: 'Hot Air Balloon Ride at Sunrise',
        description: 'Float above the stunning Cappadocia landscape at sunrise.',
        location: 'Cappadocia, Turkey',
        price: 15800, // Approximately 189.99 USD in INR
        duration: '3 hours',
        category: 'Adventure',
        image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        rating: 5.0,
        reviews_count: 1024,
        highlights: [
            'Sunrise flight',
            '60-minute balloon ride',
            'Champagne toast',
            'Flight certificate',
            'Small group experience'
        ],
        included: [
            'Hotel pickup and drop-off',
            'Light breakfast',
            'Champagne celebration',
            'Flight certificate',
            'Insurance'
        ],
        not_included: [
            'Personal expenses',
            'Photo packages',
            'Gratuities'
        ]
    },
    {
        title: 'Food Tour',
        description: 'Taste your way through Tokyo\'s best street food and hidden gems with a local foodie guide.',
        location: 'Tokyo, Japan',
        price: 5800, // Approximately 69.99 USD in INR
        duration: '3.5 hours',
        category: 'Culinary',
        image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
        rating: 4.6,
        reviews_count: 445,
        highlights: [
            '8+ food tastings',
            'Local expert guide',
            'Hidden local spots',
            'Cultural insights',
            'Small group tour'
        ],
        included: [
            'All food tastings',
            'Experienced local guide',
            'Water bottle',
            'District map'
        ],
        not_included: [
            'Hotel pickup',
            'Additional food/drinks',
            'Gratuities'
        ]
    }
];

const generateSlots = (experienceId) => {
    const slots = [];
    const today = new Date();

    // Generate slots for next 30 days
    for (let day = 0; day < 30; day++) {
        const date = new Date(today);
        date.setDate(today.getDate() + day);

        // Helper function to create time slots
        const createTimeSlot = (hours, durationHours = 2) => {
            const startTime = new Date(date);
            startTime.setHours(hours, 0, 0, 0);

            const endTime = new Date(startTime);
            endTime.setHours(startTime.getHours() + durationHours);

            return {
                start_time: startTime,
                end_time: endTime,
                max_capacity: 10,
                available_spots: Math.floor(Math.random() * 8) + 2,
                is_available: true
            };
        };

        // Morning slot (9:00 - 11:00)
        slots.push({
            experience_id: experienceId,
            date: date.toISOString().split('T')[0],
            ...createTimeSlot(9, 2)
        });

        // Afternoon slot (14:00 - 16:00)
        slots.push({
            experience_id: experienceId,
            date: date.toISOString().split('T')[0],
            ...createTimeSlot(14, 2)
        });

        // Evening slot (18:00 - 20:00)
        slots.push({
            experience_id: experienceId,
            date: date.toISOString().split('T')[0],
            ...createTimeSlot(18, 2)
        });
    }

    return slots;
};

const promoCodes = [
    {
        code: 'SAVE10',
        description: '10% off on all bookings',
        discount_type: 'percentage',
        discount_value: 10,
        min_purchase_amount: 50,
        max_discount_amount: 50,
        usage_limit: 100,
        valid_from: new Date(),
        valid_until: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
        is_active: true
    },
    {
        code: 'FLAT100',
        description: 'Flat $100 off on bookings above $200',
        discount_type: 'fixed',
        discount_value: 100,
        min_purchase_amount: 200,
        max_discount_amount: null,
        usage_limit: 50,
        valid_from: new Date(),
        valid_until: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
        is_active: true
    },
    {
        code: 'WELCOME20',
        description: '20% off for new users',
        discount_type: 'percentage',
        discount_value: 20,
        min_purchase_amount: 0,
        max_discount_amount: 100,
        usage_limit: 200,
        valid_from: new Date(),
        valid_until: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), // 120 days
        is_active: true
    }
];

const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding...');

        // Clear existing data
        await sequelize.sync({ force: true });
        console.log('✅ Database cleared');

        // Seed experiences
        const createdExperiences = await Experience.bulkCreate(experiences);
        console.log(`✅ Created ${createdExperiences.length} experiences`);

        // Seed slots for each experience
        let totalSlots = 0;
        for (const exp of createdExperiences) {
            const slots = generateSlots(exp.id);
            await Slot.bulkCreate(slots);
            totalSlots += slots.length;
        }
        console.log(`✅ Created ${totalSlots} slots`);

        // Seed promo codes
        await PromoCode.bulkCreate(promoCodes);
        console.log(`✅ Created ${promoCodes.length} promo codes`);

        console.log('🎉 Database seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();