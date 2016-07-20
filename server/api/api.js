var router = require('express').Router();

// api router will mount other routers
// for all our resources


//module.exports = router;

module.exports = function(){
 router.use('/project', require('./projects/projectRoutes')());
 return router;
};
