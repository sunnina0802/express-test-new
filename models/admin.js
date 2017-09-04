var mongoose = require('mongoose');
var Schema      = mongoose.Schema;

var manageSchema = new Schema({
    loginname:  {type:String,required: true,unique: true},
    nicname: {type: String},
    hashed_password: {type: String, required: true},
    email: {type:String,required: true,unique: true},
    createdAt: {type: Date, default: Date.now},
});


// use admin
// db.manages.insert(
//      {
//      "loginname" : "admin",
//      "nicname":"",
//      "email" : "13808013567@163.com",
//      "hashed_password" : "vLFfghR5tNV3K9DKhmwArV+SbjWAcgZZzIDTnJ0JgCo="
//      }
//  )



var Manage = mongoose.model('Manage', manageSchema);
module.exports = Manage;
