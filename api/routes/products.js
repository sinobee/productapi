const express = require('express');
const multer  = require("multer");
const checkAuth = require('../../middleware/checkToken')
const { route } = require('../../app');
const products = require("../model/productSchema");
const router = express.Router();

//image upload multer 

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.originalname);
    }
  })



const uploads = multer({storage:storage})

//imgage upload func finish

router.get("/",(req,res)=>{
    products.find().select("name price _id").then((ack)=>{
        const response = {
            count : ack.length,
            products : ack.map(docs=>{
                return {
                    name : docs.name,
                    price : docs.price,
                    _id: docs._id,
                    productsUrl : ack.productUrl,
                    request : {
                        type : "GET",
                        url : "http://localhost:3000/products/" + docs._id
                    }
                }
            }) 
        }
         res.status(200).json(response);
        
    }).catch((err)=>{
          res.status(500).json({
            message : err,
          })
    })
     
})

router.get("/:productId",(req,res)=>{
    const _id = req.params.productId;

    products.findById(_id).then((ack)=>{
           res.status(200).json({
            message :"Request get successfully",
            result : {
                name  : ack.name,
                price : ack.price,
                id : ack._id,
                request : {
                    method : "GET",
                    url :"http://localhost:3000/products/"
                }
            }
           })
    }).catch((err)=>{
        res.status(500).json({
            error : err
        })
    })
})

router.post("/",checkAuth,uploads.single("imageUpload"),(req,res)=>{
    const name  = req.body.name;
    const price = req.body.price;
    console.log(name);
    console.log(price);
    if(name=="" || price==""){
       return res.status(200).json({
            message:"name and price is empty"
        })
    }
    const product = {
        name : name,
        price : price,
   //     productUrl : req.file.path
    }
    const data = new products(product);
    data.save().then((data)=>{
        res.status(200).json({
            message :"Data save successfully",
            result : {
                name : data.name,
                price : data.price,
              //  productUrl : data.productUrl,
                id : data._id,
                request :{
                    method :"GET",
                    url : "http://localhost:3000/products/" + data._id
                }
            }
        })
    }).catch((err)=>{
     console.log(err);
     return res.status(500).json({
        error : err
     })
    })

})

router.put("/:productId",(req,res)=>{
    res.status(200).json({
        message:"This is Put requiest",
        productId:req.params.productId
    })
})
router.patch('/:productId',(req,res)=>{
   products.updateOne({_id:req.params.productId},{
    $set :{
        name : req.body.name,
        price : req.body.price
    }
   }).then((ack)=>{
       res.status(200).json({
        message : "Update successfully",
        matched_data : ack.matchedCount,
        total_data_modified: ack.modifiedCount,
        request : {
            method : "GET",
            url : "http://localhost:3000/products/" + req.params.productId
        }
       })
   }).catch((err)=>{
       res.status(500).json({
        message:err
       })
   })
})

router.delete("/:productId",(req,res)=>{
   products.deleteOne({_id:req.params.productId}).then((ack)=>{
       res.status(200).json({
        message:"Data deleted successfully",
       })
   }).catch((err)=>{
        res.status(500).json({
           message
        })
   })
})

module.exports = router;


