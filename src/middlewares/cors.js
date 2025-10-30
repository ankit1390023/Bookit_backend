const cors = require('cors');

const corsOptions = {
    origin: 'https://bookit-frontend-sepia.vercel.app',
};

module.exports = cors(corsOptions);
