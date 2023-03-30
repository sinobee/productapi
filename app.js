const express = require('express');
const productRoutes = require("./api/routes/products");
const check = require('./api/routes/check');
const users = require("./api/routes/users");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const { default: mongoose } = require('mongoose');
const app = express();
mongoose.Promise = global.Promise;
app.use("/uploads",express.static('uploads'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept,Authorization");
    if(req.method==="OPTIONS"){
        res.header("Access-Control-Allow-Origin","*");
        res.header("Access-Control-Allow-Methods","PUT,POST,PATCH,DELETE,GET");
        return res.status(200).json({});
    }
    next();
});
mongoose.connect("mongodb://localhost:27017/products");
app.use('/users',users); 
app.use('/products', productRoutes);
app.use('/check',check);

//error handling 

app.use((req,res,next)=>{
    const error = new Error("Not found");
    error.status=404;
    next(error);
})



app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error :{
            message : error.message
        }
    })
})

module.exports = app;
