var User = require('../api/user/webUserModel');
var _ = require('lodash');
var logger = require('./logger');

logger.log('Seeding the Database');

var users = [
  {name:'pat101',password: 'vol+2015', birthDate: '12/04/1989'},
  {name:'pat102',password: 'vol+2016', birthDate: '11/06/1994'},
  {name:'pat103',password: 'vol+2017', birthDate: '12/03/1993'},
  {name:'pat104',password: 'vol+2018', birthDate: '12/03/1992'},
  {name:'pat105',password: 'vol+2019', birthDate: '12/03/1991'},
  {name:'pat106',password: 'vol+2020', birthDate: '12/03/1990'}
];

var createDoc = function(model, doc) {
  return new Promise(function(resolve, reject) {
    new model(doc).save(function(err, saved) {
      return err ? reject(err) : resolve(saved);
    });
  });
};

var cleanDB = function() {
  logger.log('... cleaning the DB');
  var cleanPromises = [User]
    .map(function(model) {
      return model.remove().exec();
    });
  return Promise.all(cleanPromises);
}

var createUsers = function(data) {

  var promises = users.map(function(user) {
    return createDoc(User, user);
  });

  return Promise.all(promises)
    .then(function(users) {
      return _.merge({users: users}, data || {});
    });
};

cleanDB()
  .then(createUsers)
  .then(logger.log.bind(logger))
  .catch(logger.log.bind(logger));
