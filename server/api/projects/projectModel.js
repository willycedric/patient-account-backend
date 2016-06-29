var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var accounts = new Schema({
    login:{
      type: String,
      required: true,
      lowercase:true
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
module.exports = mongoose.model('project', projectSchema);
