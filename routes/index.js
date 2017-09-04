/**
 * Created by admin on 2017/8/10.
 */
var express = require('express');
var svgCaptcha = require('svg-captcha');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('home');
});

router.get('/about', function(req, res) {
    res.render('about');
});
router.get('/contact', function(req, res) {
    res.render('contact');
});

router.get('/captcha', function (req, res) {
    var captcha = svgCaptcha.create();
    req.session.captcha = captcha.text;

    res.set('Content-Type', 'image/svg+xml');
    res.status(200).send(captcha.data);
});

router.get('/getinfo',function (req,res) {
    var _callback = req.query.callback;

    var  _data = { phone: '(028) 23412234', name: 'Bill Node.js' };
    if ( _callback ){
        res.type('text/javascript');
        res.send(_callback + '(' + JSON.stringify(_data) + ')');
    }
    else{
        res.json(_data);
    }
});

router.get('/unauthorized', function(req, res) {
    res.status(403).render('unauthorized',{layout:null});
});




module.exports = router;
