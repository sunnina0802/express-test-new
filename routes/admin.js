var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var manageModel =require('../models/admin.js');
var pubfun =require('../lib/common.model');
var cityModel = require('../models/citys.js');
//---
var blogModel = require('../models/blog.js');
var todoModel = require('../models/todos.js');





router.get('/', function (req,res,next) {
    res.render('admin/login.hbs',{layout:null});
});


router.post('/', login);

router.get('/dashboard',dashboard);

//router.get('/changePassword',changePWD);

router.get('/areaList',authorize,areaList);

router.get('/blogList',authorize,blogList);
router.get('/content',contentList);
router.get('/todo',authorize,todoList);


router.post("/add", addSeve);
router.post("/del-city", delCity);
router.post("/edit", editSeve);
router.post("/preGetCity", getCityPre);
router.post("/getCityData", getCityData);


//-----------blogs
router.post("/add-blog", addBlogs);
router.post("/del-blog", delBlogs);
router.post("/edit-blog", editBlogs);
router.post("/preGetblog", getBlogsPre);
router.post("/getblogData",getBlogData);

//------todos
router.post("/add-todos", addTodos);
router.post("/del-todos", delTodos);
router.post("/edit-todos", editTodos);
router.post("/preGettodo", getTodoPre);
router.post("/gettodoData",getTodoData);


function  areaList(req,res) {
    isAuth(req,res,'areaList');
}
function blogList(req,res) {
    isAuth(req,res,'blogList');
    // res.render('admin/blogslist',{layout:'manage'});
}
function contentList(req,res) {
    isAuth(req,res,'content');
}
function todoList(req,res) {
    isAuth(req,res,'todo');
}

//---------------------------blog----
//传输数据到bloglist
function getBlogData (req,res) {
    var data;
    blogModel.find({},function (err,blogs) {
        if(err) {
            console.log(err);
        }
        else {
            data={
                data:blogs,
                permission:pubfun.isPermission(req,res)
            };
            res.send(data);
        }
    });
}

/*获取数据传输到profile*/
function getBlogsPre(req, res, next) {
    var data;
    blogModel.find({}, function (err, blogs) {
        if (err) {
            console.log(err);
        }
        else {
            data={
                data:blogs
            };
            res.send(data);
        }
    });
}

/*编辑数据*/
function editBlogs(req, res) {
    var data = {};
    blogModel.update({title: req.body.title},
        {
            $set: {
                title: req.body.title,
                content: req.body.content,
                comment: req.body.comment,
                commentText: req.body.commentText,
                update: true
            }
        },
        {upsert: false, multi: false})
        .exec(function (err, users) {
            if (err) {
                data = {
                    msg: 'Update failure for ' + req.body.postalCode + "===" + err,
                    code: 0
                };
            } else {
                data = {
                    msg: 'Update successful for ' + req.body.title,
                    code: 1,
                    url: '/manage/blogList'
                };
            }

            return res.send(data);
        });
}

// 删除数据
function delBlogs(req, res){
    blogModel.remove({title:req.body.title}).exec(function (err,blogs) {
        if(err){
            data = {msg: 'Update failure for '+ req.body.uid,code:'0'};
        }else {
            data = {msg: 'Update successful for '+ req.body.uid,code:'1' ,url:'/manage/blogList'};
        }
        return res.send(data);
    });
}

/*-储存数据*/
function addBlogs(req, res, next) {
    console.log('111');
    var blog = new blogModel({title: req.body.title});
    console.log(req.body.author);
    blog.set('title', req.body.title);
    blog.set('content', req.body.content);
    blog.set('author', req.body.author);
    blog.save(function (err) {
        if (err) {
            console.log(err);
            return res.redirect('/');
        } else {
            data = {
                code: 1,
                url: '/manage/blogList'
            };
            req.session.title = req.body.title;
            return res.send(data);
        }
    });
}


//===============blog end============

//=============todos================
//传输数据
function getTodoData (req,res) {
    var data;
    todoModel.find({},function (err,todos) {
        if(err) {
            console.log(err);
        }
        else {
            data={
                data:todos,
                permission:pubfun.isPermission(req,res)
            };
            res.send(data);
        }
    });
}

/*获取数据传输到profile*/
function getTodoPre(req, res, next) {
    var data;
    todoModel.find({}, function (err, todos) {
        if (err) {
            console.log(err);
        }
        else {
            data={
                data:todos
            };
            res.send(data);
        }
    });
}

/*编辑数据*/
function editTodos(req, res) {
    var data = {};
    todoModel.update({task: req.body.task},
        {
            $set: {
                task: req.body.task,
                state: req.body.state,
                update: true
            }
        },
        {upsert: false, multi: false})
        .exec(function (err, users) {
            if (err) {
                data = {
                    msg: 'Update failure for ' + req.body.task + "===" + err,
                    code: 0
                };
            } else {
                data = {
                    msg: 'Update successful for ' + req.body.task,
                    code: 1,
                    url: '/manage/todo'
                };
            }

            return res.send(data);
        });
}

// 删除数据
function delTodos(req, res){
    todoModel.remove({task:req.body.task}).exec(function (err,todos) {
        if(err){
            data = {msg: 'Update failure for '+ req.body.uid,code:'0'};
        }else {
            data = {msg: 'Update successful for '+ req.body.uid,code:'1' ,url:'/manage/todo'};
        }
        return res.send(data);
    });
}

/*-储存数据*/
function addTodos(req, res, next) {
    console.log('111');
    var blog = new blogModel({title: req.body.title});
    blog.set('title', req.body.title);
    blog.set('content', req.body.content);
    blog.set('author', req.body.author);
    blog.save(function (err) {
        if (err) {
            console.log(err);
            return res.redirect('/');
        } else {
            console.log(data);
            data = {
                code: 1,
                url: '/manage/blogList'
            };
            req.session.title = req.body.title;
            return res.send(data);
        }
    });
}
//=================todos end============










//传输数据到Citylist
function getCityData (req,res) {
    var data;
    cityModel.find({},function (err,citys) {
        if(err) {
            console.log(err);
        }
        else {
            data={
                data:citys,
                permission:pubfun.isPermission(req,res)
            };
            res.send(data);
        }
    });
}


/*城市--获取数据传输到profile*/
function getCityPre(req, res, next) {
    var data;
    cityModel.find({}, function (err, citys) {
        if (err) {
            console.log(err);
        }
        else {
            data={
                data:citys
            };
            res.send(data);
        }
    });
}

/*城市--编辑数据*/
function editSeve(req, res) {
    var data = {};
    cityModel.update({postalCode: req.body.postalCode},
        {
            $set: {
                postalCode: req.body.postalCode,
                cityname: req.body.cityname,
                spllname: req.body.spllname,
                arfa: req.body.arfa,
                update: true
            }
        },
        {upsert: false, multi: false})
        .exec(function (err, users) {
            if (err) {
                data = {
                    msg: 'Update failure for ' + req.body.postalCode + "===" + err,
                    code: 0
                };
            } else {
                data = {
                    msg: 'Update successful for ' + req.body.postalCode,
                    code: 1,
                    url: '/manage/areaList'
                };
            }

            return res.send(data);
        });
}

/*城市--删除数据*/
function delCity(req, res){
    cityModel.remove({postalCode:req.body.postalCode}).exec(function (err,citys) {
        if(err){
            data = {msg: 'Update failure for '+ req.body.uid,code:'0'};
        }else {
            data = {msg: 'Update successful for '+ req.body.uid,code:'1' ,url:'/manage/areaList'};
        }
        return res.send(data);
    });
}

/*城市--储存数据*/
function addSeve(req, res, next) {
    var city = new cityModel({postalCode: req.body.postalCode});
    city.set('cityname', req.body.cityname);
    city.set('spllname', req.body.spllname);
    city.set('arfa', req.body.arfa);
    city.set('postalCode', req.body.postalCode);
    city.set('citytel', req.body.citytel);
    city.save(function (err) {
        if (err) {
            return res.redirect('/');
        } else {
            data = {
                code: 1,
                url: '/manage/areaList'
            };
            req.session.postalCode = req.body.postalCode;
            return res.send(data);
        }
    });
}


function login(req, res) {
    var data ;
    manageModel.find({loginname:req.body.loginname,
        hashed_password:pubfun.hashPW(req.body.pwd)},function (err,manages) {

            if(err) {
                console.log(err);
            }else{
                // console.log(manages);
                if (manages.length > 0) {
                    // console.log(manages[0]);
                    req.session.adminSessionID = manages[0].id;
                    req.session.adminLoginname = manages[0].loginname;
                    data = {code: 1, url: '/manage/dashboard', msg: '登录成功！'};
                    res.send(data);
                } else {
                    data = {code: 0, url: '/manage/', errorMsg: '登录名或密码错误！'};
                    res.send(data);
                }
            }
        });
}

//主控台
function dashboard(req,res) {
    isAuth(req,res,'dashboard');
}


//验证管理员是否登录
function isAuth(req,res,routeName) {
    if(! req.session.adminSessionID)
    {
        return res.redirect('/');
    }
    else{
        res.render('admin/'+ routeName,{layout:'manage'});
    }
}

//验证管理员是否登录
function authorize(req,res,next) {
    if(req.session.adminSessionID) return next();
    res.redirect(303,'/unauthorized');
}



module.exports = router;
