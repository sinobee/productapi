const mongoose = require("mongoose");
const order = new mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    product : {type:mongoose.Schema.Types.ObjectId,ref:"products",required:true},
    quetitiy:{type:Number,default:1}
});

module.exports = mongoose.model("orders",order);