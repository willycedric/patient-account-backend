var router = require('express').Router();

// api router will mount other routers
// for all our resources
router.use('/web', require('./user/web/webUserRoutes'));
router.use('/mobile', require('./user/mobile/mobileUserRoutes'));
module.exports = router;
