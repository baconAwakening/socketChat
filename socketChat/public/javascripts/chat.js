/**
 * Created by BACON on 2017/2/22.
 */
    'use strict';
var socket = io();

$(document).click(function(event){
    if($(event.target).is('.send-msg') || $(event.target).is('.send-btn') ){
        return false;
    }
    $('.user-list').children().removeAttr('data-state').css('background','');

});
$('.user-list').delegate('button','click',function(event){
    event.stopPropagation();
    $('.user-list').children().removeAttr('data-state').css('background','');
    $(this).attr('data-state','selected').css('background','#f5f5f5');
});


//更新用户
socket.emit('init info',null);
//setInterval(function(){
//    socket.emit('init info',null);
//},1000);
socket.on('init info',function(msg){  //通过socket.on接受后台发送过来的msg\
    let userList = msg.userList;
    var str = '';
    let domArr = [];
    let newArr = [];
    $('.list-group').children().each(function(){  //获取页面已有的username
        domArr.push($(this).text());
    });
    if(domArr.length > userList.length){   //判断是否有客户端离线
        newArr = userList;
    }else{
        userList =new Set(domArr.concat(userList));   //去重  Set{xx,xx,xx}
        for (const value of userList) {  //遍历存入数组
            newArr.push(value);
        }
    }

    for (var i = 0, len = newArr.length; i < len; i++) {
        str += `<button type="button" class="list-group-item">${newArr[i]}</button>`
    }
    $('.list-group').html(str);
});

socket.on('update user',function(userList){   //断开连接后接收在线用户
    var str = '';
    for (var i = 0, len = userList.length; i < len; i++) {
        str += `<button type="button" class="list-group-item">${userList[i]}</button>`
    }
    $('.list-group').html(str);
})


//全体广播
$('.send-btn').click(function(){
    //if($('.user-list').children())
    //获取
    var privateUser = '';
    $('.list-group').children().each(function(){
        if($(this).attr('data-state') == 'selected'){
            privateUser = $(this).text();
        }
    });
    console.log('222',privateUser);
    if(privateUser != ''){
        //私聊
        console.log(privateUser);
        var msg = {
            receiveUser:privateUser,
            message:$('.send-msg').val()
        };
        socket.emit('the private chat',msg);   //通过socket.emit发射到后台
    }else{
        //全体广播
        socket.emit('chat message',$('.send-msg').val());   //通过socket.emit发射到后台
    }
    $('.send-msg').val('');
});
socket.on('chat message',function(msg){  //通过socket.on接受后台发送过来的msg\
    $('.msg-list').append($(`<li>
        <strong>${msg.username}:</strong>
        <span>${msg.msg}</span>
    </li>`));
});

//接受私聊
socket.on('the private chat',function(msg){  //通过socket.on接受后台发送过来的msg\
    $('.msg-list').append($(`<li style="color: #FE6553">
        <strong>${msg.sendUser}悄悄对你说:</strong>
        <span>${msg.message}</span>
    </li>`));
});
//发出私聊的信息
socket.on('sendUser the private chat',function(msg){  //通过socket.on接受后台发送过来的msg\
    $('.msg-list').append($(`<li style="color: #35C87A;">
        <strong>你悄悄对${msg.receiveUser}说:</strong>
        <span>${msg.message}</span>
    </li>`));
});