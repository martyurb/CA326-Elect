var mongoose = require('mongoose');

var schema = mongoose.Schema;

var voteSchema = new schema({
    created_at: {
        type: Number,
        required: true
    },
    pollid:{
        type:String,
        required:true
    },
    author:{
      type:String,
      required:false
    },
    option:{
        type:String,
        required:true,
    },
    voteType: {
            code: {
                type: Number,
                required: true
            },
            name: {
                type: String,
                required: true
            },
    }
})


module.exports = mongoose.model('votes',voteSchema,'votes');
