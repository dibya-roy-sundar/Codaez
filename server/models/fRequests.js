const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fRequestSchema = new Schema({
    sender:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    reciever:{
        type: Schema.Types.ObjectId,
        ref: "User",
    }
});

const FRequest = mongoose.model("FRequest", fRequestSchema);
module.exports = FRequest;