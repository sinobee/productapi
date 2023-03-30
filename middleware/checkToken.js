const jwt = require("jsonwebtoken");
const { token } = require("morgan");
require('dotenv').config()

module.exports = (req,res,next)=>{
      try{
          const token = req.headers.authorization.split(" ")[1];
          console.log(token);
          const decoder = jwt.verify(token, process.env.SECRET_KEY);
          req.userData=decoder;
          next();
      }catch(error){
        return res.status(401).json({
            message : "auth failed123",
            token : token
         })
      }
}

