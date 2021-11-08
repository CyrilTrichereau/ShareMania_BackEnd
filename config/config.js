require("dotenv").config();
module.exports = {
  development: {
    username: process.env.DEV_DATA_BASE_USER,
    password: process.env.DEV_DATA_BASE_PASSWORD,
    database: process.env.DEV_DATA_BASE_NAME,
    host: process.env.DEV_DATA_BASE_HOST,
    dialect: process.env.DEV_DATA_BASE_DIALECT,
  },
  test: {
    username: process.env.TEST_DATA_BASE_USER,
    password: process.env.TEST_DATA_BASE_PASSWORD,
    database: process.env.TEST_DATA_BASE_NAME,
    host: process.env.TEST_DATA_BASE_HOST,
    dialect: process.env.TEST_DATA_BASE_DIALECT,
  },
  production: {
    username: process.env.PROD_DATA_BASE_USER,
    password: process.env.PROD_DATA_BASE_PASSWORD,
    database: process.env.PROD_DATA_BASE_NAME,
    host: process.env.PROD_DATA_BASE_HOST,
    dialect: process.env.PROD_DATA_BASE_DIALECT,
  },
};
