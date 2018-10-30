require('dotenv').config();
module.exports = {
  development: {
    username: 'postgres',
    password: null,
    database: 'fetch-dev',
    host: '127.0.0.1',
    dialect: 'postgres',
    logging: false,
    operatorsAliases: false
  },
  test: {
    username: 'postgres',
    password: null,
    database: 'fetch-test',
    host: '127.0.0.1',
    dialect: 'postgres',
    logging: false,
    operatorsAliases: false
  },
  production: {
    username: process.env.HEROKU_DB_USER,
    password: process.env.HEROKU_DB_PW,
    db: process.env.HEROKU_DB_URI,
    host: process.env.HEROKU_DB_PORT,
    dialect: 'postgres'
  }
};
