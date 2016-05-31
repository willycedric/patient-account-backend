var projectModel = require('../api/projects/projectModel');
var _ = require('lodash');
var logger = require('./logger');

logger.log('Seeding the Database');

var projectUsers = [
        {
          name:'Redwing',
          accounts:[
            {
              login:"vvredwing+01@gmail.com",
              password:"vol+2016",
              dateOfBirth:"12/01/1945",
              name:"pat01",
            },
            {
              login:"vvredwing+02@gmail.com",
              password:"vol+2017",
              dateOfBirth:"12/11/1945",
              name:"pat02",
            },
            {
              login:"vvredwing+03@gmail.com",
              password:"vol+2018",
              dateOfBirth:"12/10/1945",
              name:"pat03",
            }
          ]     
        },
         {
          name:'Diabeo',
          accounts:[
            {
              login:"vvdiabeo+01@gmail.com",
              password:"vol+2016",
              dateOfBirth:"12/07/1975",
              name:"pat11",
            },
            {
              login:"vvdiabeo+02@gmail.com",
              password:"vol+2017",
              dateOfBirth:"12/08/1975",
              name:"pat12",
            },
            {
              login:"vvdiabeo+03@gmail.com",
              password:"vol+2018",
              dateOfBirth:"12/09/1975",
              name:"pat13",
            }
          ]     
        }  
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
  var cleanPromises = [projectModel]
    .map(function(model) {
      return model.remove().exec();
    });
  return Promise.all(cleanPromises);
}

var createProject = function(data) {

  var promises = projectUsers.map(function(user) {
    return createDoc(projectModel, user);
  });

  return Promise.all(promises)
    .then(function(projectUsers) {
      return _.merge({projectUsers: projectUsers}, data || {});
    });
};

cleanDB()
  .then(createProject)
  .then(logger.log.bind(logger))
  .catch(logger.log.bind(logger));
