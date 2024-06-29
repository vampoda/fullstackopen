const config=require("./utils/config")
const express=require("express")
require('dotenv').config();
 
const app=express()
const cors=require("cors")
const usersRouter=require("./controllers/users")
const blogsRouter=require("./controllers/blogs")
const loginRouter=require("./controllers/login")
const middleware=require("./utils/middleware")
const logger=require("./utils/logger")
const mongoose=require("mongoose")
mongoose.set("strictQuery",false)
logger.info("connecting to",config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI,{
    serverSelectionTimeoutMS: 10000,
}).then(()=>{
    logger.info("connected to mongodb")
}).catch(error=>{
    logger.error("error connecting to mongodb",error.message

    )
})



app.use(cors())
app.use(express.static("build"))
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtrator)
app.use(middleware.userExtractor)
app.use("/api/blogs",blogsRouter)
app.use("/api/users",usersRouter)
app.use("/api/login",loginRouter)

if(process.env.NODE_ENV==="test"){
    const testingRouter=require("./controllers/testing")
    app.use("/api/testing",testingRouter)
console.log("test environment")
}
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)
module.exports=app 