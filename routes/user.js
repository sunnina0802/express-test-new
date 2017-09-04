/**
 * Created by admin on 2017/8/10.
 */
var express = require('express');
var mongoose = require('mongoose');
var validator = require('validator');
var formidable = require('formidable');
var pubfun    = require('../lib/common.model.js');
var credentials = require('../credentials');
var emailService = require('../lib/email')(credentials);
var userModel = require('../models/users');

// cms
var cmsModel = require('../models/cms');
var ObjectId = require('mongodb').ObjectID;
var fs = require('fs');
const  AVATAR_UPLOAD_FOLDER = '/avatar/';

var router = express.Router();

router.post('/sign-up', signUp);
router.post('/sign-in', signIn);
router.get('/profile',getProfile);

router.post('/profile-save',profileSave);
router.post('/upload-profile/:phone',uploadProfile);
router.get('/list',getUsers);

router.post('/list',delUser);



router.post('/jqpost',function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.send('<p>999get--这是与Node.js通信后的结果：AJAX is not a programming language. 57657674u It is just a technique for creating better and more interactive web applications.'+
        '这是段落的一些文本</p>'+
        '<p><img src="/course/img/tyhy/2.jpg" width="200" height="60"></p>');
});


function signUp(req,res,next)
{
    var data;
    if(req.session.captcha.toLowerCase() !== req.body.captcha.toLowerCase())
    {
        data = {captchaErrorMsg: '请检查码证码是否正确！'};
        return res.send(data);
    }

    var errMsg = checkSignUp(req,res);
    if(errMsg.length>0)
    {
        return res.send(errMsg);
    }

    var user = new userModel({tel:req.body.tel});
    user.set('hashed_password',pubfun.hashPW(req.body.password));
    user.set('email', '');
    user.save(function(err) {
        if (err){
            console.log(err);
            return res.redirect('/');
        } else {

            // emailService.send(req.body.email,'Thank you for signup!','<h3>Dear customer friend</h3>Thank you for signup my site!');

            data = {code: 1,
                url:'/users/profile'};
            req.session.tel = req.body.tel;
            return res.send(data);
            //return res.render('users/profile');
        }
    });

}

function checkSignUp(req,res)
{
    var errMsg = '';
    if(!validator.isMobilePhone(req.body.tel,'zh-CN'))
    {
        errMsg +='手机号码格式错误，请重新输入';
    }
    if(!validator.isLength(req.body.password,{min:6,max:8}))
    {
        errMsg +='密码格式有误，请重新输入';
    }
    return errMsg;
}

router.post('/check-phone',function (req,res,next) {
    var data;
    userModel.find()
        .where('tel')
        .equals(req.body.tel)
        .select('tel')
        .exec(function (err,users) {
            var context = {
                users: users.map(function(user){
                    return {
                        tel: user.tel
                    };
                })
            };
            if(context.users.length>0)
            {
                data = {errorMsg: 'tel number' +req.body.tel +'已经存在,请另输入一个'};
            }
            return res.send(data);

        });
});

router.post('/check-email',function (req,res,next) {
    var data;
    userModel.find()
        .where('email')
        .equals(req.body.email)
        .select('email')
        .exec(function (err,users) {
            var context = {
                users: users.map(function(user){
                    return {
                        email: user.email
                    };
                })
            };
            if(context.users.length>0)
            {
                data = {errorMsg: 'email' +req.body.email +'已经存在,请另输入一个'};
            }
            return res.send(data);

        });
});


function profileSave(req,res) {
    var data = {};
    userModel.update({tel:req.body.tel},
        {$set:{username:req.body.username,
            realname:req.body.realname,
            nickname:req.body.nickname,
            gender:req.body.gender,
            email:req.body.email,
            age:req.body.age,
            address:req.body.address,
            update:true}},
        {upsert:false,multi:false})
        .exec(function (err,users) {
            if(err){
                data = {msg: 'Update failure for '+ req.body.tel +"==="+err,
                    code:0};
            }else {

                data = {msg: 'Update successful for '+ req.body.tel,
                    code:1 ,
                    url:'/users/list'};

               emailService.send(
                    req.body.email,
                    'Thank you for signup!',
                    '<h3>Dear customer friend</h3>Thank you for signup my site!');
            }

            return res.send(data);
        });
}

function getUsers(req,res,next){
    userModel.find({},function (err,users) {
        if(err){
            console.log(err);
        }else{
            res.render('users/list',{data:users});
        }

    });
}

function checkSignIn(req,res)
{
    var errMsg = '';
    if(!validator.isMobilePhone(req.body.tel,'zh-CN'))
    {
        errMsg +='手机号码格式错误，请重新输入';
    }
    if(!validator.isLength(req.body.password,{min:6,max:8}))
    {
        errMsg +='密码格式有误，请重新输入';
    }
    return errMsg;
}

function signIn(req,res,next) {
    var data;
    if(req.session.captcha.toLowerCase() !== req.body.captcha.toLowerCase())
    {
        data = {captchaErrorMsg: '请检查码证码是否正确！'};
        return res.send(data);
    }

    var errMsg = checkSignIn(req,res);
    if(errMsg.length>0)
    {
        return res.send(errMsg);
    }
    userModel.find(
        {'tel':req.body.tel,
            'hashed_password':pubfun.hashPW(req.body.password)}
        ,function (err,users) {
            if(err)
            {
                console.log(err);
                return res.redirect('/');
            }else {
                if(users.length>0){
                    req.session.tel=users[0].tel;

                    req.session.loginName=users[0].tel;

                    res.redirect('/users/profile');

                }


            }

        });
}

function getProfile(req,res,next) {

    userModel.find(
        {'tel':req.session.tel},function (err,users) {
            if(err)
            {
                console.log(err);
            }else {
                if(users.length>0)
                {
                    var context = {};
                    var now         = new Date();
                    context.tel   = req.body.tel;
                    context.year    = now.getFullYear();
                    context.month   = now.getMonth();
                    context.timestr = Date.now();
                    context.user    = users[0];
                    res.render('users/profile',context);
                }

            }

        });
}

function uploadProfile(req,res) {
    console.log(req.body);
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';		//设置编辑
    form.uploadDir = 'public' + AVATAR_UPLOAD_FOLDER;	 //设置上传目录
    form.keepExtensions = true;	 //保留后缀
    form.parse(req, function(err, fields, files){
        if(err) return res.redirect(303, '/error');

        var extName = '';  //后缀名
        switch (files.photo.type) {
            case 'image/pjpeg':
                extName = 'jpg';
                break;
            case 'image/jpeg':
                extName = 'jpg';
                break;
            case 'image/png':
                extName = 'png';
                break;
            case 'image/x-png':
                extName = 'png';
                break;
        }
        console.log(files);
        //req.params.timestr
        var newPath = 'public\\avatar_2\\'+req.params.timestr+"."+extName;

        fs.renameSync(files.photo.path, newPath);  //重命名
        //console.log(files.photo.path+"-----"+files.photo.name +"###"+ extName +"==="+req.params.year);
        //console.log('received fields:');
        var imgpath='/avatar_2/'+req.params.timestr+"."+extName;
        updateProfilePicture (req.params.phone,imgpath);

        //var data = {imgpath:imgpath};
        return  res.redirect('/users/profile?imgpath='+imgpath);
        // return  res.send(data);

    });
}
//更新个人俏像
function updateProfilePicture (tel,imgpath) {
    var data = {};

    userModel.update({tel:tel},
        {$set:{picture:imgpath,
            update:true}},
        {upsert:false,multi:false}).exec(function (err,users) {
        if(err){
            data = {msg: 'Update failure for '+ tel,code:'0'};
        }else {

            data = {msg: 'Update successful for '+ tel,code:'1'};
        }

    });
}


//删除文件保存

function delUser(req,res) {
    userModel.remove({tel:req.body.tel}).exec(function (err,users) {
        if(err){
            data = {msg: 'Update failure for '+ req.body.tel,code:'0'};
        }else {
            data = {msg: 'Update successful for '+ req.body.tel,code:'1' ,url:'/users/list'};
        }
        return res.send(data);
    });
}

//cms

router.post('/cms-del',delCms);
router.get('/cms',getCms);


router.get('/:id/cmsupdate', getCmsUpdate);
router.get('/cmsupdate/:title', getCMSByTitle);
router.get('/cmsadd', addCMS);
router.post('/newCMS', newCMS);

router.post('/upload-cms/:title/:year/:month/:timestr', uploadCmsPicture);

router.post('/cms-save',cmsSave);


function getCms(req,res,next){
    cmsModel.find({},function (err,cms) {
        if(err){
            console.log(err);
        }else{
            res.render('users/cms',{data:cms});
        }

    });
}

function getCMSByTitle(req, res, next) {
    cmsModel.find({title: req.params.title}, function(err, cms){
        if (err) {
            console.log(err);
        }else{
            if (cms.length) {
                res.render('users/cmsupdate', {cms: cms[0]});
            }
        }
    });
}

function getCmsUpdate(req,res,next) {
    cmsModel.find({_id: ObjectId(req.params.id)}, function(err, cms){
        if (err) {
            console.log(err);
        }else{
            if (cms.length) {
                var context = {};
                var now = new Date();
                context.year    = now.getFullYear();
                context.month   = now.getMonth();
                context.timestr = Date.now();
                context.cms = cms[0];
                res.render('users/cmsupdate', context);
            }
        }
    });
}

function addCMS(req, res, next) {
    var context = {};
    var now = new Date();
    context.year    = now.getFullYear();
    context.month   = now.getMonth();
    context.timestr = Date.now();
    res.render('users/cmsadd', context);
}

function newCMS(req, res, next){
    var data;
    var cms = new cmsModel({
        title: req.body.title,
        content: req.body.content,
        authorid: req.body.authorid
    });

    cms.save(function(err) {
        if (err){
            console.log(err);
            return res.redirect('/');
        } else {
            data = {
                msg: 'Add successful for '+ req.body.title,
                code: 1,
                url:'/users/cms'
            };

            return res.send(data);
        }
    });
}

function cmsSave(req,res) {
    console.log('333');
    var data = {};

    cmsModel.update({title:req.body.title},
        {$set:{content:req.body.content,
            // pictureurl:req.body.pictureurl,
            authorid:req.body.authorid,
            update:true}},
        {upsert:false,multi:false})
        .exec(function (err,cms) {
            if(err){
                data = {msg: 'Update failure for '+ req.body.title +"==="+err,
                    code:0};
            }else {

                data = {msg: 'Update successful for '+ req.body.title,
                    code:1 ,
                    url:'/users/cms'};
            }

            return res.send(data);
        });
}



function checkCmsAdd(req,res)
{
    var errMsg = '';
    if(!validator.isMobilePhone(req.body.authorid,'zh-CN'))
    {
        errMsg +='用户ID格式错误，请重新输入';
    }
    return errMsg;
}



function uploadCmsPicture(req,res) {
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';		//设置编辑
    form.uploadDir = 'public' + AVATAR_UPLOAD_FOLDER;	 //设置上传目录
    form.keepExtensions = true;	 //保留后缀
    form.parse(req, function(err, fields, files){
        if(err) return res.redirect(303, '/error');

        var extName = '';  //后缀名
        switch (files.photo.type) {
            case 'image/pjpeg':
                extName = 'jpg';
                break;
            case 'image/jpeg':
                extName = 'jpg';
                break;
            case 'image/png':
                extName = 'png';
                break;
            case 'image/x-png':
                extName = 'png';
                break;
        }

        var newPath = 'public/avatar_2/'+req.params.timestr+"."+extName;

        fs.renameSync(files.photo.path, newPath);  //重命名
        //console.log(files.photo.path+"-----"+files.photo.name +"###"+ extName +"==="+req.params.year);
        //console.log('received fields:');
        var imgpath='/avatar_2/'+req.params.timestr+"."+extName;
        updateCmsPicture(req.params.title,imgpath);

        var data = {imgpath:imgpath};
        return  res.redirect('/users/cmsupdate/' + req.params.title+ '?imgpath='+imgpath);
        // return  res.send(data);

    });
}
//更新个人俏像
function updateCmsPicture (title,imgpath) {
    var data = {};

    cmsModel.update({title:title},
        {$set:{pictureurl:imgpath,
            update:true}},
        {upsert:false,multi:false}).exec(function (err,cms) {
        if(err){
            data = {msg: 'Update failure for '+ title,code:'0'};
        }else {

            data = {msg: 'Update successful for '+ title,code:'1'};
        }

    });
}

function delCms(req,res){
    cmsModel.remove({title:req.body.title}).exec(function (err,cms) {
        if(err){
            data = {msg: 'Update failure for '+ req.body.title,code:'0'};
        }else {
            data = {msg: 'Update successful for '+ req.body.title,code:'1' ,url:'/users/cms'};
        }
        return res.send(data);
    });
}





module.exports = router;
















