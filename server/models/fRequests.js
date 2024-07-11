const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fRequestSchema = new Schema({
    senderusername: String,
    sendername :String,
    senderuserId:String,
    senderavatar:{
        url: String,
        filename: String,
    },
    recieverUserId:String ,
});

const FRequest = mongoose.model("FRequest", fRequestSchema);
module.exports = FRequest;