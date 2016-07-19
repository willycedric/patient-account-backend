// intro point for our server.
// PRO-TIP: if you have an index.js file
// on the root of a folder in node
// you can just require that folder and node will
// automatically require the index.js on the root

// setup config first before anything by requiring it
var config = require('./server/config/config');
var app = require('./server/server');
var logger = require('./server/util/logger');
var server = require('http').Server(app);
var io =require('socket.io')(server);
var server = app.listen(config.port);

var io =require('socket.io')(server);

io.on('connect', function(socket){
	console.log('a client is successfully connected');
});
logger.log('listening on http://localhost:' + config.port);


