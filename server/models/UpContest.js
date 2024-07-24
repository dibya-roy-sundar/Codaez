const mongoose = require('mongoose');
const Schema=mongoose.Schema;

const upContestSchema=new Schema({
    title:String,
    startTime:Number, //in ms
    duration:Number,//in Hrs.
    url:String,
    platform:String,
    expireAt: { type: Date, index: { expires: 10 } } //TTL index only worked with date field -0 immediately ,10-after 10s
})

upContestSchema.pre('insertMany', function (next,docs) {
    docs.forEach(doc => {
      doc.expireAt = new Date(doc.startTime + doc.duration * 3600000); 
    });
    next();
  });

module.exports = mongoose.model('UpContest', upContestSchema);