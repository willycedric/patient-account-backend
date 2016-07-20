var router = require('express').Router();
var logger = require('../../util/logger');
/*var controller = require('./projectController')();*/
// setup boilerplate route just to satisfy a request
// for building



//module.exports = router;

module.exports = function (){
	var controller = require('./projectController')();
	router.param('id', controller.params);
	router.route('/')
	  .get(controller.get)
	  .post(controller.isUser,controller.post)
	  .delete(controller.isUserDeletion,controller.delete);

	router.route('/:id')
	  .get(controller.getOne)
	  .put(controller.put);
	  return router;
};
