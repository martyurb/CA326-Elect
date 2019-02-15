var mongoose = require('mongoose');

var schema = mongoose.Schema;

var pollSchema = new schema({
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
    title:{
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
    },
    options:{
        type:[[Mixed]],
        required:true
<<<<<<< Updated upstream
<<<<<<< Updated upstream
=======
    },
    votes: {
      type: []
>>>>>>> Stashed changes
=======
    },
    votes: {
      type: []
>>>>>>> Stashed changes
    },
    close_at: {
      type: Number,
      requreired:false
    }
})


module.exports = mongoose.model('polls',pollSchema,'polls');
