var mongoose = require('mongoose');
var Schema      = mongoose.Schema;

var userSchema = new Schema({
    username: {type: String},
    realname: {type: String},
    hashed_password: {type: String, required: true},
    email: {type:String},
    age: {type: Number},
    picture: {type: String},
    //morePictures: Schema.Types.Mixed, // this is not required
    //loginname:  {type:String,required: true,unique: true},
    gender: {type: Number},
    nickname: {type: String},
    address: {type: String},
    tel: {type: Number, required: true, unique: true},
    createdAt: {type: Date, default: Date.now}
});

var User = mongoose.model('User', userSchema);
module.exports = User;