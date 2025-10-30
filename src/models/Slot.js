const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Slot = sequelize.define('Slot', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    experience_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'experiences', // This references the 'experiences' table
        key: 'id'
      }
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    max_capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10
    },
    available_spots: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    is_available: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
}, {
    tableName: 'slots',
    timestamps: true,
    underscored: true
  });

  return Slot;
};