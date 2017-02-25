/**
 * Created by BACON on 2017/2/21.
 */
module.exports = {
    userId:{
        type:String,
        required:true,
        maxLength:16, //最大最小长度
        minLength:4
    },
    password:{
        type:String,
        required:true,
        maxLength:16,
        minLength:4
    }

};