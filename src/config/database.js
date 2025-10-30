const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.MYSQL_ADDON_URI,
    {
        dialect: 'mysql',
        logging: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        define: {
            timestamps: true,
            underscored: true
        }
    }
);

const connectDB = async () => {
    try {
        // Test the connection
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully.');

        // Import models
        const models = require('../models');

        // Sync models in development
        if (process.env.NODE_ENV === 'development') {
            await sequelize.sync({ alter: true });
            console.log('✅ Database models synchronized.');
        }

        return sequelize;
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
        process.exit(1);
    }
};

module.exports = { 
    sequelize, 
    connectDB,
    Sequelize 
};