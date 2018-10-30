const logger = require('morgan');
const path = require('path');
const express = require('express');
// Route initialization
module.exports = {
  init(app) {
    const staticRoutes = require('../routes/static');
    const userRoutes = require('../routes/users');
    app.use(
      logger(
        ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'
      )
    );

    // Serve any static files
    const staticFiles = express.static(
      path.join(__dirname, '..', '..', '..', 'client/build')
    );

    app.use(staticFiles);
    console.log('staticfiles', staticFiles);
    app.use(staticRoutes);
    app.use(userRoutes);
  }
};
