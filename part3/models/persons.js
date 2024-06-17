const mongoose=require("mongoose")
mongoose.set("strictQuery",false)
const dotenv=require("dotenv")
dotenv.config()

const url=process.env.MONGODB_URI
console.log("connecting to ",url)

mongoose.connect(url).then(result=>console.log("connected")).catch(error=>console.log("error connecting mongodb",error.message))


const personSchema=new mongoose.Schema({
    name:{
        type:String,
        minLength:3,
        required:true
    },
    number:{
        type:String,
        minLength:8,
        required:true
    }
})

personSchema.set("toJSON",{
    transform:(document,returnObject)=>{
        returnObject.id=returnObject._id.toString();
        delete returnObject._id;
        delete returnObject._v;

    }

});


module.exports=mongoose.model("Person",personSchema)