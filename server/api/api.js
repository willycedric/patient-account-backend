var router = require('express').Router();

// api router will mount other routers
// for all our resources
router.use('/web', require('./user/web/webUserRoutes'));
router.use('/mobile', require('./user/mobile/mobileUserRoutes'));
router.use('/practician', require('./user/practicians/practicianUserRoutes'));
router.use('/operator', require('./user/operators/operatorUserRoutes'));
router.use('/superuser', require('./user/superusers/superUserRoutes'));
module.exports = router;
