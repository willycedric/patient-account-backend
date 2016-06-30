var Project = require('./projectModel');
var _ = require('lodash');
var logger = require('../../util/logger');
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
    Project.findOne({name: req.body.attachedProjectName}, function(err, project){
        if(err){
          next(err);
        }else if(Project.isAccountAlreadyTaken(req.body)) {
            req.isAccountAlreadyTaken=true;            
            next();    
        }else{
          next();
        }
    });
  }else{
    req.isUser = !req.isUser;
    Project.findOne({name:req.body.name}, function(err,project){
        if(err){
          next(err);
        }else if(Project.isAccountAlreadyTaken(req.body)){
          req.isProjectAlreadyExist = !req.isProjectAlreadyExist;
        }
    });
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
/**
 * [post description]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.post = function(req, res, next) {
  if(!req.isUser){
    if(req.isProjectAlreadyExist){
      res.send("The project "+req.body.name+" already exist !")
    }else{
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
    }
      
  }else{

    if(req.isAccountAlreadyTaken){
      res.send("The login "+req.body.login+" has already been taken!");
    }else{
           var projectName = req.body.attachedProjectName;
          delete req.body.attachedProjectName;
          var newAccount = req.body;
          //console.log("   ", JSON.stringify(req.body));
          Project.findOne({name:projectName}, function (err, project){
              if(err){
                  return  next(err);
              }else{
                      project.accounts.push(newAccount);
                      project.save(function(err,elt){
                        if(err){
                          return next(err);
                        }else{
                          console.log(JSON.stringify)
                          res.json({project:elt});
                        }
                      });
              }
          });
    }
         
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
