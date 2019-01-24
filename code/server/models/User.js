var mongoose = require('mongoose')
var schema = mongoose.Schema;

var userSchema = new schema({
    fullname:{
        type:String,
        required:false,
    },
    idToken:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    photo:{
        type:String,
        required:false,
    }
})


module.exports = mongoose.model('users',userSchema,'users');
