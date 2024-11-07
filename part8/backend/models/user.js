const mongoose=require("mongoose")

const uniqueValidator=require("mongoose-unique-validator")

const schema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        minlength:3,
        unique:true

    },
    password:{
      type:String,
      required:true
    },
    favouriteGenre:{
      type:String,
required:true
    }
})
schema.plugin(uniqueValidator)

module.exports=mongoose.model("User",schema)