var express = require('express');
var app = express();
var api = require('./api/api');
var config = require('./config/config');
var logger = require('./util/logger');
//Socket io for live update on user creation, update and delete
//var io = require('socket.io')(4001);
var server = require('http').Server(app);
var io =require('socket.io')(server);

//var auth = require('./auth/routes');
// db.url is different depending on NODE_ENV
require('mongoose').connect(config.db.voluntis);
if (config.seed) {
  require('./util/seed');
}else{
	logger.log('Seeding deactivated ...');
}
// setup the app middlware
require('./middleware/appMiddlware')(app);

// setup the api
app.use('/api', api);
//app.use('/auth', auth);

// set up global error handling
app.use(function(err, req, res, next) {
  // if error thrown from jwt validation check
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('Invalid token');
    return;
  }
  logger.error(err);
  res.status(500).send('internal server error');
});

// export the app for testing
module.exports = app;
