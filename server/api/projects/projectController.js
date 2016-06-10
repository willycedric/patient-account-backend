var Project = require('./projectModel');
var _ = require('lodash');
var logger = require('../../util/logger');
exports.params = function(req, res, next, id) {
    logger.log("Params function from the projectController");
    Project.findById(id,function(err,project) {
      if(err){
        next(err);
      }
      else if (!project) {
        next(new Error('No project with that id'));
      } else {
        req.project = project;
        next();
      }
    });
};

exports.get = function(req, res, next) {
  logger.log('get from the projectController');
   Project.find({}, function(err, projects) {
    var projectMap = {};

    projects.forEach(function(project) {
      projectMap[project._id] = project;
    });
    res.send(projectMap);  
  });
};

exports.getOne = function(req, res, next) {
  logger.log("getOne function from the projectController");
  var project = req.project;
  res.json(project);
};

exports.put = function(req, res, next) {
  var project = req.project;
  project.accounts = req.body.accounts;
  //_.merge(project, update);
    logger.log(JSON.stringify(project));

  logger.log("Je suis a ce niveau");
  Project.findOne({name:project.name},function(err,elt){
      if(err){
        return next(err);
      }else if(elt){
          project.save(function(err, saved) {
            if (err) {
              next(err);
            } else {
              res.json(saved);
            }
         });
      }else{

      }
  });
};

exports.post = function(req, res, next) {
  var newProject = new Project(req.body);
  Project.findOne({name:newProject.name}, function(err, elt){
    if(err){
      return next(err);
    }else if(!elt){
      newProject.save(function(err,project){
        if(err){
          return next(err);
        }
        res.json({project:project});
      })
    }else{

    }
  });
};

exports.delete = function(req, res, next) {
  Project.findByIdAndRemove(req.param('id'), function(err,removed){
    if(err){
      next(err);
    }else{
      res.json(removed);
    }
  });
};

exports.me = function(req, res) {
  res.json(req.project);
};
