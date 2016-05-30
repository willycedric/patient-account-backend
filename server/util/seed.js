var webUserModel = require('../api/user/web/webUserModel'),
  mobileUserModel = require('../api/user/mobile/mobileUserModel');
var _ = require('lodash');
var logger = require('./logger');

logger.log('Seeding the Database');

var webUsers = [
  {name:'pat101',password: 'vol+2015', birthDate: '12/04/1989'},
  {name:'pat102',password: 'vol+2016', birthDate: '11/06/1994'},
  {name:'pat103',password: 'vol+2017', birthDate: '12/03/1993'},
  {name:'pat104',password: 'vol+2018', birthDate: '12/03/1992'},
  {name:'pat105',password: 'vol+2019', birthDate: '12/03/1991'},
  {name:'pat106',password: 'vol+2020', birthDate: '12/03/1990'}
];

var mobileUsers = [
  {name:'mob101',password: 'vol+2015', birthDate: '12/04/1989'},
  {name:'mob102',password: 'vol+2016', birthDate: '11/06/1994'},
  {name:'mob103',password: 'vol+2017', birthDate: '12/03/1993'},
  {name:'mob104',password: 'vol+2018', birthDate: '12/03/1992'},
  {name:'mob105',password: 'vol+2019', birthDate: '12/03/1991'},
  {name:'mob106',password: 'vol+2020', birthDate: '12/03/1990'}
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
  var cleanPromises = [webUserModel,mobileUserModel]
    .map(function(model) {
      return model.remove().exec();
    });
  return Promise.all(cleanPromises);
}

var createUsers = function(data) {

  var promises = webUsers.map(function(user) {
    return createDoc(webUserModel, user);
  });

  return Promise.all(promises)
    .then(function(webUsers) {
      return _.merge({webUsers: webUsers}, data || {});
    });
};

var createMobileUsers = function(data) {

  var promises = mobileUsers.map(function(user) {
    return createDoc(mobileUserModel, user);
  });

  return Promise.all(promises)
    .then(function(mobileUsers) {
      return _.merge({mobileUsers: mobileUsers}, data || {});
    });
};

cleanDB()
  .then(createUsers)
  .then(createMobileUsers)
  .then(logger.log.bind(logger))
  .catch(logger.log.bind(logger));
