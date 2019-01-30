var mongoose = require('mongoose');

var schema = mongoose.Schema;

var pollSchema = new schema({
    authorId:{
        type:String,
        required:true,
    },
    title:{
        type:String,
        required:true,
    },
    type:{
        type:String,
        required:true,
    },
    voteOptions:{
        type:[{
          type: String
        }],
        required:true,
    }
})


module.exports = mongoose.model('polls',userSchema,'polls');
