/**
 * Created by JerrySives on 2017/8/18.
 */

var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var cmsSchema = new Schema({
    title: {type: String,required:true,unique: true}, //标题
    content: {type: String},//内容
    pictureurl: {type: String}, //图片
    // brief: {type: String}, //摘要
    authorid: {type: Number}, //作者ID
    createdAt: {type: Date, default: Date.now}
});

var Cms = mongoose.model('Cms', cmsSchema);
module.exports = Cms;