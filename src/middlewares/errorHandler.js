const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Sequelize validation error
    if (err.name === 'SequelizeValidationError') {
        const errors = err.errors.map(e => ({
            field: e.path,
            message: e.message
        }));

        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors
        });
    }

    // Sequelize unique constraint error
    if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
            success: false,
            message: 'Duplicate entry',
            field: err.errors[0]?.path
        });
    }

    // Sequelize database error
    if (err.name === 'SequelizeDatabaseError') {
        return res.status(500).json({
            success: false,
            message: 'Database error occurred'
        });
    }

    // Default error
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = errorHandler;