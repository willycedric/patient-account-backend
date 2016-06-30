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
exports.isUser = function (req, res, next){
  if(req.body.role){
      Project.findOne({name: req.body.attachedProjectName}, function(err, project){
        if(err){
            next(err);
        }else{
                 project.accounts.forEach(function(account, key){
                      if( req.body.login == account.login){
                          req.isLoginTaken = true;
                      }else{
                        req.isLoginTaken=false;
                      }
                });
        }
      });
      req.isUser = true;
      next();
  }else{
    req.isUser = false;
    next();
  }
};

exports.isUserDeletion = function (req, res, next){
  if (req.param('accountID')){
    req.isUserDeletion=true;
    next();
  }else{
    req.isUserDeletion=false;
    next();
  }
};
exports.get = function(req, res, next) {
   Project.find({}, function(err, projects) {
    var projectMap = {};

    projects.forEach(function(project) {
      projectMap[project._id] = project;
    });
    res.send(projectMap);  
  });
};

exports.getOne = function(req, res, next) {
  var project = req.project;
  res.json(project);
};

exports.put = function(req, res, next) {
  var project = req.project;
  project.accounts = req.body.accounts;
  //_.merge(project, update);
    logger.log(JSON.stringify(project));

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
  if(!req.isUser){
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
  }else{
      var projectName = req.body.attachedProjectName;
      delete req.body.attachedProjectName;
      var newAccount = req.body;
      Project.findOne({name:projectName}, function (err, project){
          if(err){
              return  next(err);
          }else if (!req.isLoginTaken){                 

                  project.accounts.push(newAccount);
                  project.save(function(err,elt){
                    if(err){
                      return next(err);
                    }else{
                      console.log(JSON.stringify)
                      res.json({project:elt});
                    }
                  });
        }else{
                res.status(205).send("The login "+newAccount.login+" it's already taken");
        }
      });
  }  
};


exports.delete = function(req, res, next) {
    if(!req.isUserDeletion){
          Project.findByIdAndRemove(req.param('id'), function(err,removed){
        if(err){
          next(err);
        }else{
          res.json(removed);
        }
      });
    }else{
       //console.log( req.param('projectID'), req.param('accountID'));
       Project.findById(req.param('projectID'), function(err, project){
          if(err){
              next(err);
          }else{
            //project.accounts(req.param('accountID')).remove();
            project.accounts.forEach(function(account, key){
                if(account._id == req.param('accountID')){
                  project.accounts[key].remove();
                }
            });
            project.save(function(err, proj){
                if(err){
                  next(err);
                }else{
                  res.json({project:proj});
                }
            });
          }
       });
    }
};

exports.me = function(req, res) {
  res.json(req.project);
};
