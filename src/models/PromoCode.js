const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PromoCode = sequelize.define('PromoCode', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    discount_type: {
        type: DataTypes.ENUM('percentage', 'fixed'),
        allowNull: false
    },
    discount_value: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    },
    min_purchase_amount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    max_discount_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    usage_limit: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    used_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    valid_from: {
        type: DataTypes.DATE,
        allowNull: false
    },
    valid_until: {
        type: DataTypes.DATE,
        allowNull: false
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'promo_codes',
    timestamps: true,
    underscored: true
  });

  return PromoCode;
};