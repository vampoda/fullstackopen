const mongoose=require("mongoose")
const uniqueValidator=require("mongoose-unique-validator");
const author = require("./author");

const schema=new mongoose.Schema({
    title:{
        type:String,
        required:true, 
        unique:true,
        minlength:5 
    },
    published:{
        type:String,

    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
ref:"Author"        
    },
    genres:[
        {type:String}
    ]

})
schema.plugin(uniqueValidator)

module.exports=mongoose.model("Book",schema)
