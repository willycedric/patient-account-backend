var router = require('express').Router();

// api router will mount other routers
// for all our resources
router.use('/project', require('./projects/projectRoutes'));

module.exports = router;
