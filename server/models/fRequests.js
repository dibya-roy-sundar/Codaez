const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fRequestSchema = new Schema({
    senderusername: String,
    sendername :String,
    senderavatar:{
        url: String,
        filename: String,
    },
    recieverusername:String ,
});

const FRequest = mongoose.model("FRequest", fRequestSchema);
module.exports = FRequest;