var mongoose = require('mongoose');

var schema = mongoose.Schema;

var pollSchema = new schema({
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
    options:{
        type:[String],
        required:false,
    },
    isOpen:{
      type:Boolean,
      required:true,
    }
})


module.exports = mongoose.model('polls',pollSchema,'polls');
