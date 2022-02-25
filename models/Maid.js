const mongoose = require('mongoose')
const MaidSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true
    },
    gender:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    status:{
        type:Boolean,
        default:true 
    },
    age:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true 
    },
    userImg:{
        type:String
    },
    phone:{
        type:String,
        required:true 
    },
    service:{
        type:String,
        required:true 
    },
    date:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model('Maids',MaidSchema);