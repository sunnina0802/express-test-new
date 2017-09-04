var mongoose = require('mongoose');
var Schema  = mongoose.Schema;



var todoSchema = new Schema({
    task: {type: String, required: true},//工作
    state: {type:Number,default:0},
    userid: {type: String},
    createdAt: {type: Date, default: Date.now},
});


var Todo = mongoose.model('Todo', todoSchema);



/* 预置Todo信息，

 use admin
  db.todos.insert(
      {
       task: '买牛奶',
       state: 0,
       userid: '5949e427223826079ce4c2e9',
       createdAt:'1504522624000'
      }
  )
 */
