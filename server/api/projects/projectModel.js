var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var accounts = new Schema({
    login:{
      type: String,
      required: true,
      lowercase:true,
      unique:[true,'{VALUE} already taken !']
    },
    password:{
      type:String,
      required:true
    },
    dateOfBirth:{
      type:Date
    },
    name:{
      type: String,
      required:true,
      lowercase:true
    },
    role:{
      type:String,
      default:'patient',
      lowercase:true
    }
});

var projectSchema = new Schema({
  name:{
    type:String,
    required:true,
    unique:true,
    uppercase:true
  },
  accounts:[accounts]
});

/**
 * [isAccountAlreadyTaken description]
 * @param  {[type]}  newAccount [description]
 * @return {Boolean}            [description]
 */
projectSchema.statics.isAccountAlreadyTaken = function isAccountAlreadyTaken(newAccount){ //statics allow for defining functions that exist directly on your model
  
  return false;
  
};
module.exports = mongoose.model('project', projectSchema);
