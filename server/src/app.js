const express = require('express');
const app = express();
// app.use(express.json());
const routeConfig = require('./config/route-config.js');
const appConfig = require('./config/main-config.js');

routeConfig.init(app);
appConfig.init(app, express);

module.exports = app;
