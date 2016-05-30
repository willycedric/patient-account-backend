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
    default:'patient'
  },
  password: {
    type: String,
    required: true
   
  }
  
});
module.exports = mongoose.model('webUser', webUserSchema);
