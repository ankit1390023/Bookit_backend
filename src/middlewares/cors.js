const cors = require('cors');
require('dotenv').config();
const corsOptions = {
    origin:process.env.FRONTEND_URL,
};

module.exports = cors(corsOptions);
