var User = require('./superUserModel');
var _ = require('lodash');
exports.params = function(req, res, next, id) {
    User.findById(id,function(err,user) {
      if(err){
        next(err);
      }
      else if (!user) {
        next(new Error('No user with that id'));
      } else {
        req.user = user;
        next();
      }
    });
};

exports.get = function(req, res, next) {
   User.find({}, function(err, users) {
    var userMap = {};

    users.forEach(function(user) {
      userMap[user._id] = user;
    });
    res.send(userMap);  
  });
};

exports.getOne = function(req, res, next) {
  var user = req.user;
  res.json(user);
};

exports.put = function(req, res, next) {
  var user = req.user;

  var update = req.body;

  _.merge(user, update);

  User.findOne({name:user.name},function(err,elt){
      if(err){
        return next(err);
      }else if(!elt){
          user.save(function(err, saved) {
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
  var newUser = new User(req.body);
  User.findOne({name:newUser.name}, function(err, elt){
    if(err){
      return next(err);
    }else if(!elt){
      newUser.save(function(err,user){
        if(err){
          return next(err);
        }
        res.json({user:user});
      })
    }else{

    }
  });
};

exports.delete = function(req, res, next) {
  User.findByIdAndRemove(req.param('id'), function(err,removed){
    if(err){
      next(err);
    }else{
      res.json(removed);
    }
  });
};

exports.me = function(req, res) {
  res.json(req.user);
};
