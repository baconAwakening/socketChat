/**
 * Created by BACON on 2017/2/20.
 */
'use strict';
const express = require('express');
const router = express.Router();

router.route('/')
    .get(function(req,res,next){
        req.session.logined = false;
        req.session.username = null;
        res.redirect('/');
    });

module.exports = router;