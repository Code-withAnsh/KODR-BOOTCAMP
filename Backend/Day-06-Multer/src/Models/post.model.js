const mongoose = require("mongoose")


const userSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    imageurl:{
        type:String,
        required:true
    },
    
    imagekitfieldid:{
type:String,
required:true
    }
    })
    const userModel = mongoose.model("users",userSchema)
    module.exports = userModel