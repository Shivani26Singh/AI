const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, 'environments', `.env.${process.env.TEST_ENV || 'default'}`) });

const config = {
  baseURL: process.env.BASE_URL,
  auth: {
    username: process.env.AUTH_USERNAME,
    password: process.env.AUTH_PASSWORD,
    endpoint: '/auth',
  },
  endpoints: {
    auth: '/auth',
    booking: '/booking',
    ping: '/ping',
  },
  timeouts: {
    default: 30000,
    auth: 10000,
    health: 5000,
  },
  responseTimeThreshold: 3000,
};

module.exports = config;
