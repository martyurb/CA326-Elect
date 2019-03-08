var mongoose = require('mongoose');

var schema = mongoose.Schema;

var testUserSchema = new schema({
    userid:{
        type:String,
        required:true
    },
    fullname:{
        type:String,
        required:true,
    },
    token:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    photo:{
        type:String,
        required:true,
    }
})


module.exports = mongoose.model('testUsers',testUserSchema,'testUsers');
