const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required:true
    },
    fullName:{
        type:String,
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
        type:String
    },
    date:{
        type:Date,
        default:Date.now
    }
})
module.exports = mongoose.model('Users',UserSchema);
