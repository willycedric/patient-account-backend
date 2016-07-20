var Project = require('./projectModel');
var _ = require('lodash');
var logger = require('../../util/./logger');
//Variable and method used to check if a login has already been used 
var isLoginAlreadyUsed = function(accounts,login,bool){
  var isTaken=bool;
  accounts.forEach(function(account, key){
      if(account.login == login){
          isTaken = true;
    }
  });
  return isTaken;
};

/**
 * [params description]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @param  {[type]}   id   [description]
 * @return {[type]}        [description]
 */
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
/**
 * [isUser description]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {Boolean}       [description]
 */
exports.isUser = function (req, res, next){
  req.isAccountAlreadyTaken= false;
  req.isProjectAlreadyExist = false;
  if(req.body.role){
    req.isUser = true;
    next();
  }else{
    req.isUser = false;
    next();
  }
};

/**
 * [isUserDeletion description]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {Boolean}       [description]
 */
exports.isUserDeletion = function (req, res, next){
  if (req.param('accountID')){
    req.isUserDeletion=true;
    next();
  }else{
    req.isUserDeletion=false;
    next();
  }
};
/**
 * [get description]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
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

/**
 * [put description]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.put = function(req, res, next) {
  Project.findOne({name:req.project.name},function(err,project){
      if(err){
        return next(err);
      }else if(project){
          _.merge( project.accounts.id(req.body.account._id), req.body.account);
          project.save(function(err, saved) {
            if (err) {
               var errorMessage=[];
                if(err.errors){
                    for (var errorName in err.errors){
                      errorMessage.push(err.errors[errorName].message);
                    }// end for 
                    res.status(202).json(errorMessage);
                }else{
                    next(err);
                }
            } else {
              res.json(saved);
            }
         });
      }else{

      }
  });
};
/**
 * [post description]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.post = function(req, res, next) {
//list of errors message which will be sent back to the client once the request has been processed
 var errorMessage=[];
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
              errorMessage.push("The name " +req.body.name+" is already used!")
              res.status(202).json({errorMessage:errorMessage});
          }
        });      
  }else{
          var projectName = req.body.attachedProjectName;
          delete req.body.attachedProjectName;
          var newAccount = req.body;
          Project.findOne({name:projectName}, function (err, project){
              if(err){
                  return  next(err);
              }else{                      
                     if(isLoginAlreadyUsed(project.accounts, newAccount.login,false)){
                        errorMessage.push("The login "+newAccount.login+" is already used!")
                        res.status(202).json(errorMessage);
                     }else{
                          project.accounts.push(newAccount);
                          project.save(function(err,elt){
                            if(err){
                              if(err.errors){
                                  for (var errorName in err.errors){
                                   errorMessage.push(err.errors[errorName].message);
                                  }// end for 
                                  res.status(202).json({errorMessage:errorMessage});
                              }else{
                                 return next(err);
                              }
                            }else{
                              res.json({project:elt});
                            }
                          });
                   }
                      
              }
          });
    }
};

/**
 * [delete description]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.delete = function(req, res, next) {
    if(!req.isUserDeletion){
          Project.findByIdAndRemove(req.param('projectID'), function(err,removed){
        if(err){
          next(err);
        }else{
          res.json(removed);
        }
      });
    }else{
       Project.findById(req.param('projectID'), function(err, project){
          if(err){
              next(err);
          }else{
            //console.log("Inside the delete function ", JSON.stringify(project.accounts.id(req.param('accountID'))));
            project.accounts.id(req.param('accountID')).remove();
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
/**
 * [me description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.me = function(req, res) {
  res.json(req.project);
};


