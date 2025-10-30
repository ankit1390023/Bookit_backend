const express = require('express');
const dotenv = require('dotenv');
const corsMiddleware = require('./src/middlewares/cors.js');
const logger = require('./src/middlewares/logger.js');
const errorHandler = require('./src/middlewares/errorHandler.js');
const notFound = require('./src/middlewares/notFound.js');
const { connectDB } = require('./src/config/database');
const routes = require('./src/routes');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger (only in development)
if (process.env.NODE_ENV === 'development') {
    app.use(logger);
}

// API routes
app.use('/api', routes);

// Root route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to BookIt API',
        version: '1.0.0',
        endpoints: {
            experiences: '/api/experiences',
            bookings: '/api/bookings',
            promo: '/api/promo',
            health: '/api/health'
        }
    });
});

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`
    🚀 Server running in ${process.env.NODE_ENV || 'development'} mode
    📡 Listening on port ${PORT}
    🌐 URL: http://localhost:${PORT}
    📚 API Docs: http://localhost:${PORT}/api
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    // Close server & exit process
    process.exit(1);
});