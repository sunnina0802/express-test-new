var mongoose = require('mongoose');
var Schema  = mongoose.Schema;

var blogSchema = new Schema({
    title: {type: String,required: true},
    content: {type: String,required: true},
    authorid: {type: String},
    like:[{author:{type: String}}],
    author:{type:String,required: true},
    comment:[{
        content:{type: String},
        author:{type: String},
        authorId:{type: String},
        createdAt: {type: Date, default: Date.now}
    }]
});

var Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;


// use admin
// db.blogs.insert(
//     {
//         title: '你身后有一个强大的祖国',
//         content:'战狼2中最火的一句话',
//         author:"jack-test",
//         author_id: "5949e427223826079ce4c2e9",
//         comment: [
//             {
//                 content:'火火火火火火火火火',
//                 author:"594c60cfda91c98e0c1a784a",
//                 authorId: "594c60cfda91c98e0c1a784a",
//                 createdAt:"1504522624000"

//             }

//         ],
//         like: [{author: 'bill'}],

//     }
// )
