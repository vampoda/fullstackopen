const bcrypt=require("bcrypt")
const userRouter=require("express").Router()
const User=require("../models/user")
userRouter.post("/",async(request,response)=>{
    try{
    const{username,name,password}=request.body
    const saltRounds=10
const passwordHash=await bcrypt.hash(password,saltRounds)
const user=new User({
    username,
    name,
    passwordHash
})

console.log(user);
const savedUser=await user.save()
console.log(savedUser)
response.status(201).json(savedUser)
    }catch(error){
        console.log(error)
        response.status(401).json({error:error.message})
    }
})
module.exports=userRouter