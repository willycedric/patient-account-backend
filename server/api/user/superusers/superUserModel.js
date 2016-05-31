var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var superUserSchema = new Schema({
	name:{
		type:String,
		required:true,
		unique:true
	},
  birthDate: {
    type: String,
    required: true
  },
  role:{
    type:String,
    default:'backoffice'
  },
  password: {
    type: String,
    required: true
   
  }
  
});
module.exports = mongoose.model('superUser', superUserSchema);
