const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Experience = sequelize.define('Experience', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    },
    duration: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image_url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rating: {
        type: DataTypes.DECIMAL(2, 1),
        defaultValue: 0,
        validate: {
            min: 0,
            max: 5
        }
    },
    reviews_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    highlights: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    included: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    not_included: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'experiences',
    timestamps: true,
    underscored: true
  });

  return Experience;
};