var mongoose = require('mongoose');

var schema = mongoose.Schema;

var userSchema = new schema({
    userid:{
        type:String,
        required:true
    },
    fullname:{
        type:String,
        required:true,
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
        required:true,
    },
    publicKey:{
        type:String,
        required:false
    }
})


module.exports = mongoose.model('users',userSchema,'users');
