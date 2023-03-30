//npm package
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const user = require("../model/user");
const router = express.Router();

//model


router.post("/singnup",(req,res)=>{
   user.find({email : req.body.email}).then(data=>{
      if(data.length>=1){
        return res.status(409).json({
            message : "Email is already exiest"
        })
      }else{
             bcrypt.hash(req.body.password,10,(err,hash)=>{
                  if(err){
                    return res.status(500).json({
                        message : err
                    })
                  }else{
                      const newUser = {
                        email : req.body.email,
                        password : hash
                      }
                  
                      const data = new user(newUser);
                      data.save().then(ack => {
                        const response = { 
                            message : "User is created successfully",
                           result : {
                             email : ack.email,
                             password : ack.password
                           }     
                        }
                        res.status(201).json(response);
                      }).catch(err =>{
                           res.status(500).json({
                            message : err
                           })
                      })
                  }
             })
      }
   }).catch(err=>{
       res.status(500).json({
        message : err
       });
   })   
})

router.post("/login",(req,res)=>{
    user.find({email:req.body.email}).then(user=>{
        console.log(user);
        if(user.length<1){
            return res.status(401).json({
                user : false,
                message : " User not exiest",
            })
        }

         bcrypt.compare(req.body.password,user[0].password,(err,result)=>{
            if(err){
                return res.status(500).json({
                    user:false,
                    message : err
                 })
            }

            if(result){
                const token = jwt.sign({
                    email:user[0].email,
                    userId:user[0].password
                },
                "secret",
                {
                    expiresIn:"24h"
                }
                );

                return res.status(200).json({
                    user:true,
                    message : "auth successfully",
                    token:token
                })
            }

            res.status(401).json({
                user:false,
                message: "Auth failed"
            })


         })


    }).catch(err=>{

    })
})

module.exports = router;



