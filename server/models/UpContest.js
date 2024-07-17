const mongoose = require('mongoose');
const Schema=mongoose.Schema;

const upContestSchema=new Schema({
    title:String,
    startTime:Number,
    duration:Number,//in Hrs.
    url:String,
    platform:String,
})

module.exports = mongoose.model('UpContest', upContestSchema);