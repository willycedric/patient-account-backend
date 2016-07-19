var morgan = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');
var override = require('method-override');
// setup global middleware here

var whitelist = ['http://192.168.3.208:4500'];
var corsOptions = {
  origin: function(origin, callback){
    var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
    callback(null, originIsWhitelisted);
  }
};
module.exports = function(app) {
  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(function(req, res, next) {
	  res.set({
	  	"Access-Control-Allow-Origin":"true",
	  	"Access-Control-Allow-Headers":"Origin, X-Requested-With, Content-Type, Accept"
	  });
	  next();
  });
  app.use(cors(
  	{
  		"Access-Control-Allow-Origin":true
  	}));
  app.use(override());
};
