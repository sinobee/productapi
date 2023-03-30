const mongoose = require("mongoose");
const productsSchema = new mongoose.Schema({
     name : {type:String,required:true},
     price : {type:Number,required:true},
     productUrl :{type:String}
})

module.exports = mongoose.model('products',productsSchema);
