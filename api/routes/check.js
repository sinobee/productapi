const express = require("express");
const  route = express.Router();


route.get('/',(req,res)=>{
    console.log("get route is colled");
})


route.post('/',(req,res)=>{

})



module.exports = route;