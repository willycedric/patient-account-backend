var mongoose = require('mongoose');
var rule = require('validator');
var Schema = mongoose.Schema;
var projectSchema = new Schema({
  name:{
    type:String,
    required:true,
    unique:true,
    uppercase:true
  },
  accounts:[{
     login:{
      type: String,
      required: true,
      lowercase:true,
      unique:true,
      validate:{
        validator:function(login){
        if(rule.isEmail(login)){
          return true;
        }else{
          return false
        }
      },
      msg:'{VALUE} is not a valid email'
    }
   },
    password:{
      type:String,
      required:true
    },
    dateOfBirth:{
      type:String,
      validate: {
        validator: function(date){
            if(rule.isDate(date)){
              return true;
            }else{
              return false;
            }
        },
        msg:'{VALUE} is not a valid date'
      }
    },
    name:{
      type: String,
      required:true,
      lowercase:true,
      validate:{
        validator: function(name){
          if(rule.isNumeric(name)){
            return false;
          }else{
            return true;
          }
        },
      msg:'{VALUE} is not a valid name'
      }
    },
    role:{
      type:String,
      default:'patient',
      lowercase:true
    }
  }]
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
