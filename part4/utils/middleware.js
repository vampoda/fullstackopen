const logger=require("./logger")
const jwt=require("jsonwebtoken")
const User=require("../models/user")
require('dotenv').config();

const requestLogger=(req,res,next)=>{
    logger.info("method",req.method)
    logger.info("path",req.path)
    logger.info("boddy",req.body)
    logger.info("---")
    next()
}

const unknownEndpoint=(req,res)=>{
    res.status(404).send({error:"unknown endpoint"})
}
const errorHandler=(error,req,res,next)=>{
    logger.error(error.message)
    if(error.name==="castError"){
        return res.status(400).send({error:"malformatted id"})

    }else if(error.name==="ValidationError"){
        return res.status(400).send({error:error.message})

    }
    else if(error.name==="MongoServerError" && error.message.includes("E1100 duplicate key error")){
        return res.status(400).send({error:"expected `username` to be unique"})

    }else if(error.name==="JsonWebTokenError"){
        return res.status(401).json({error:"token invalid"})

    }
    next(error)
}

const tokenExtrator=(req,res,next)=>{
 const authorization=req.get("authorization")
 if(authorization && authorization.startsWith("Bearer ")){
    req.token=authorization.replace("Bearer ","");
    return next()
 }   
 req.token=null;
 
 //console.log("auntorization",authorization)
 return next();
}

const userExtractor=async(req,res,next)=>{
   console.log(process.env.SECRET,"secet")
    if(!req.token){
        req.user=null;
    }
    
else{


    try{
        const decodedToken=jwt.verify(req.token,process.env.SECRET);
        console.log("decoded",decodedToken)
        if(!decodedToken.id){
req.user=null

        }
        else{
            req.user=await User.findById(decodedToken.id)
            console.log(req.user,"req.user")
        }
    }catch(error){
console.log(error.message,"mama")

        req.user=null;
    }
}
next()
}

module.exports={
    requestLogger,unknownEndpoint,errorHandler,tokenExtrator,userExtractor
}


