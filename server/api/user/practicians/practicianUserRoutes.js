var router = require('express').Router();
var logger = require('../../../util/logger');
var controller = require('./practicianUserController');
// setup boilerplate route jsut to satisfy a request
// for building
router.param('id', controller.params);
router.route('/')
  .get(controller.get)
  .post(controller.post)
  .delete(controller.delete)

router.route('/:id')
  .get(controller.getOne)
  .put(controller.put)
  

module.exports = router;
