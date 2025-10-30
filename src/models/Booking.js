const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Booking = sequelize.define('Booking', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    experience_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'experiences',
            key: 'id'
        }
    },
    slot_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'slots',
            key: 'id'
        }
    },
    booking_reference: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    number_of_people: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
            min: 1
        }
    },
    base_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    discount_amount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    total_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    promo_code: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'failed'),
        defaultValue: 'pending'
    },
    special_requests: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'bookings',
    timestamps: true,
    underscored: true
});

  return Booking;
};