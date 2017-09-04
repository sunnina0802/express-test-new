var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var citySchema = new Schema({
    cityname: {type: String,required: true,unique: true},//城市
	spllname: {type: String},//拼写
    arfa:{type: String,required: true},	//简写编码"大写"
    postalCode:{type: Number,required: true,unique: true},//邮政编码
    citytel:{type: Number},
    createdAt: {type: Date, default: Date.now}//提交时间
});

var City = mongoose.model('City', citySchema);
module.exports = City;


