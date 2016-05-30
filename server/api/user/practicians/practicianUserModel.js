var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var webUserSchema = new Schema({
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
    default:'practician'
  },
  password: {
    type: String,
    required: true
   
  }
  
});
module.exports = mongoose.model('practicianUser', webUserSchema);
