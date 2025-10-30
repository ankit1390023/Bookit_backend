const { sequelize } = require('../config/database');

// Import model files
const User = require('./User');
const Experience = require('./Experience');
const Slot = require('./Slot');
const Booking = require('./Booking');
const PromoCode = require('./PromoCode');

// Initialize models
const models = {
  User: User(sequelize),
  Experience: Experience(sequelize),
  Slot: Slot(sequelize),
  Booking: Booking(sequelize),
  PromoCode: PromoCode(sequelize)
};

// Destructure models
const { User: UserModel, Experience: ExperienceModel, Slot: SlotModel, Booking: BookingModel, PromoCode: PromoCodeModel } = models;

// Define associations
// Experience-Slot associations
ExperienceModel.hasMany(SlotModel, {
  foreignKey: 'experience_id',
  as: 'slots'
});

SlotModel.belongsTo(ExperienceModel, {
  foreignKey: 'experience_id',
  as: 'experience'
});

// User-Booking associations
UserModel.hasMany(BookingModel, {
  foreignKey: 'user_id',
  as: 'userBookings'
});

BookingModel.belongsTo(UserModel, {
  foreignKey: 'user_id',
  as: 'user'
});

// Experience-Booking associations
ExperienceModel.hasMany(BookingModel, {
  foreignKey: 'experience_id',
  as: 'experienceBookings'
});

BookingModel.belongsTo(ExperienceModel, {
  foreignKey: 'experience_id',
  as: 'experience'
});

// Slot-Booking associations
SlotModel.hasMany(BookingModel, {
  foreignKey: 'slot_id',
  as: 'slotBookings'
});

BookingModel.belongsTo(SlotModel, {
  foreignKey: 'slot_id',
  as: 'slot'
});

// Export models and sequelize instance
module.exports = {
  ...models,
  sequelize,
  Sequelize: require('sequelize')
};