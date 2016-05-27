var User = require('./webUserModel');
var _ = require('lodash');
exports.params = function(req, res, next, id) {
  User.findById(id)
    .select('-password')
    .exec()
    .then(function(user) {
      if (!user) {
        next(new Error('No user with that id'));
      } else {
        req.user = user;
        next();
      }
    }, function(err) {
      next(err);
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

  user.save(function(err, saved) {
    if (err) {
      next(err);
    } else {
      res.json(saved);
    }
  })
};

exports.post = function(req, res, next) {
  var newUser = new User(req.body);
  //console.log(newUser);
  newUser.save(function(err, user) {
    if(err) { return next(err);}
    res.json({user: user});
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
