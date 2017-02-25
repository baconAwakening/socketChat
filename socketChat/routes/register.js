/**
 * Created by BACON on 2017/2/20.
 */
'use strict';
const express = require('express');
const router = express.Router();
let mongoDB = require(rootPath +'/lib/mongo/mongodb');

router.route('/')
    .get(function(req,res,next){
        if(req.session.logined){
            res.redirect('/index');
        }else{
            res.render('register');
        }

    })
    .post(function(req,res,next){
        let registerUser = req.body.registerUser,
            registerPassword = req.body.registerPassword;
        mongoDB.findUser(registerUser)  //查询数据库
        .then((docs)=>{
            if(docs.length != 0){
                res.render('register',{registered:true})  //存在userId 就刷新页面提示重新注册
            }else{
                mongoDB.saveUser(registerUser,registerPassword);
                req.session.logined = true;
                req.session.username = registerUser;
                res.cookie("username",registerUser, { maxAge:1000*60*60*24*7, httpOnly: true });
                res.redirect('/index');
            }
        });
    });

module.exports = router;