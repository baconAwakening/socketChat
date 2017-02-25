/**
 * Created by BACON on 2017/2/21.
 */
'use strict';
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost:27017/socket_chat');

mongoose.connection.on('error',function(error){
    console.error('数据库连接失败：'+error)
});

mongoose.connection.on('open',function(){
    console.log('数据库连接成功')
});

let userSchemaConfig = require('./config/userSchemaConfig');

class MongoDB{
    constructor(){
        this.userSchema = new mongoose.Schema(userSchemaConfig);
        this.userModel = mongoose.model('user',this.userSchema);
        this.userEntity = new this.userModel();
    }
    findUser(userId){
        var getResult = this.userModel.find({userId:userId})
                    .exec() //mongoose返回promise
                    .then(function(promiseResult){
                        //console.log('promise',promiseResult);  //[{_id:xxx},{_id:xxx}]
                        return promiseResult;
                    });
        return getResult;
    }
    saveUser(userId,password){
        this.userModel.create({userId:userId,password:password},function(error){
            if(error){
                console.log('mongodb.js / saveUser',error);
            }else{
                console.log('mongodb.js / saveUser',userId +' 已存入数据库');
            }
        });
    }
}
let mongoDB = new MongoDB();

module.exports = mongoDB;