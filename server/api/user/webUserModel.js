var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var webUserSchema = new Schema({
	name:{
		type:String,
		required:true
	},
  birthDate: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
   
  }
  
});
module.exports = mongoose.model('webUser', webUserSchema);
