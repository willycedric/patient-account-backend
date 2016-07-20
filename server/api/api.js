var pod = require('express').Router();

// api router will mount other routers
// for all our resources
/*
pod.use('/project', require('./projects/projectRoutes')());
module.exports = pod;*/

module.exports = function(io){ 
	return pod.use('/project', require('./projects/projectRoutes')(io)); 	

};
