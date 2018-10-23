const expressValidator = require('express-validator');
const passportConfig = require('./passport-config');
const session = require('express-session');
const flash = require('express-flash');

require('dotenv').config();

module.exports = {
  init(app, express) {
    app.use(express.json());
    app.use(expressValidator());
    app.use(
      session({
        secret: process.env.cookieSecret,
        resave: false,
        saveUninitialized: false,
        cookie: {maxAge: 1.21e9} //set cookie to expire in 14 days
      })
    );
    app.use(flash);
    passportConfig.init(app);

    app.use((req, res, next) => {
      res.locals.currentUser = req.user;
      next();
    });
  }
};
