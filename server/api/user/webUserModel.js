var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var webUserSchema = new Schema({
  password: {
    type: String,
    required: true
   
  },
  birthDate: {
    type: String,
    required: true
  }
});
module.exports = mongoose.model('webUser', webUserSchema);
