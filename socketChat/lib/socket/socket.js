/**
 * Created by BACON on 2017/2/22.
 */
'use strict';
var userList = [];
var sockets = {};
var i = 1;
var qs = require('querystring');
module.exports = function(server){

    var io = require('socket.io')(server);
    io.on('connection',function(socket){  //连接事件输入插座
        //
        let cookies = socket.handshake.headers.cookie;
        let cookieJson = qs.parse(cookies.split(';').join('&').split(' ').join(''));
        /*
         username=asdsad; io=iZaQG_ZRpsvyxWk9AAAB
        ['username=asdsad',' io=iZaQG_ZRpsvyxWk9AAAB']
         username=asdsad& io=iZaQG_ZRpsvyxWk9AAAB
         ['username=asdsad','io=iZaQG_ZRpsvyxWk9AAAB']
         username=asdsad&io=iZaQG_ZRpsvyxWk9AAAB
         {username:asdsad,xxx:xxx}
         */
        if(userList.indexOf(cookieJson.username) == -1){
            userList.push(cookieJson.username);
            sockets[cookieJson.username] = socket;
            console.log(Object.getOwnPropertyNames(sockets));
        }
        socket.on('init info',function(msg){
            var msg = {
                userList:userList
            };
            io.emit('init info', msg);
        });
        socket.on('disconnect', function() {
            let cookies = socket.handshake.headers.cookie;  //获取断开的cookies
            let cookieJson = qs.parse(cookies.split(';').join('&').split(' ').join(''));
            let delUser = cookieJson.username;  //获取断开的username
            for(var i=0; i<userList.length; i++) {  //遍历删除断开的user
                if(userList[i] == delUser) {
                    userList.splice(i, 1);
                    break;
                }
            }
            delete sockets[delUser];   //删除user对应的sockets

            io.emit('update user', userList);


        });

        //解析cookie为json 取出username
        socket.on('chat message',function(msg){
            var msg = {
                "msg":msg,
                "username":cookieJson['username']
            };
            //sockets['asdsad'].emit('chat message', msg); //将消息发给每个人
            io.emit('chat message',msg); //将消息发给每个人
        })

        socket.on('the private chat',function(msg){
            console.log('private',msg);
            /*
             private { receiveUser: '4444', message: '',sendUser:'xxx' }
             */
            msg.sendUser = cookieJson['username'];
            sockets[msg.receiveUser].emit('the private chat', msg);
            sockets[msg.sendUser].emit('sendUser the private chat', msg);
            //var msg = {
            //    "msg":msg,
            //    "username":cookieJson['username']
            //};
            //sockets['asdsad'].emit('chat message', msg); //将消息发给每个人
            //io.emit('chat message',msg); //将消息发给每个人
        })
    });

};
