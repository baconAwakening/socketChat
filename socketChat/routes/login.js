/**
 * Created by BACON on 2017/2/20.
 */
'use strict';
const express = require('express');
const router = express.Router();
var mongoDB = require(rootPath +'/lib/mongo/mongodb');

router.route('/')
    .get(function(req,res,next){
        if(req.session.logined){
            res.redirect('/index');
        }else{
            res.render('login',{isLogined:req.session.logined})
        }
    })
    .post(function(req,res,next){
        var userId =  req.body.userId,
            password = req.body.password;
        mongoDB.findUser(userId)
        .then((docs)=>{
            if(docs.length == 1){
                /*
                 [ { _id: 58abecbc53af301a0cd85859,
                 userId: 'asdsad',
                 password: 'asdads',
                 __v: 0 } ]

                 */
                var json = docs[0];
                if(userId === json.userId && password === json.password){
                    req.session.logined = true;
                    req.session.username = userId;
                    res.cookie("username",userId, { maxAge:1000*60*60*24*7, httpOnly: true });
                    res.redirect('/index');
                }else{
                    res.render('login',{error:true,isLogined:req.session.logined})
                }
            }else{
                res.render('login',{error:true,isLogined:req.session.logined})
            }
        })
    });

module.exports = router;