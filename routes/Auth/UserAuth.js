const express = require('express')
const router = express.Router() 
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET
const { body, validationResult } = require('express-validator');

// middleware 
const FetchUser = require('../FetchUser')
// importing user model 
const Users  = require('../../models/User')

// ROUTE 01 : Register a User
router.post('/register', [
    body('email','Invalid Email').isEmail(),
    body('password' , 'Password must be atleast 5 characters').isLength({min:5})
], async (req,res)=>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    let success = false 
    // checking if already exists 
    let user = await Users.findOne({email:req.body.email});
    if(user){
        return res.status(401).json({success:success , msg:"Email already registered"})
    }
    // hashing the password 
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password , salt)
    try {
        user = new Users({
            email:req.body.email,
            fullName:req.body.fullName,
            password:hashedPassword,
            phone:req.body.phone,
            userImg : 'uploads\\users\\default_image.png' 
        })
        const newUser = await user.save();
        const data = {
            user:{
                id:user.id 
            }
        }
        const authToken = jwt.sign(data,JWT_SECRET)
        success = true 
        res.status(200).json({success,authToken});  
        
    } catch (error) {
        res.status(401).json({success,msg:"Internal Server Error"})
        console.log(error.message)
    }
})
// ROUTE 02 : Login a User 
router.get('/login', [
    body('email','Invalid Email').isEmail(),
    body('password','Password must be atleast 5 characters').isLength({min:5})
], async (req,res)=>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    let success = false 
    try {
        let user = await Users.findOne({email:req.body.email})
        if(!user){
            return res.status(401).json({success,msg:"User Not Exists"})
        }
        let comparePassword = await bcrypt.compare(req.body.password ,user.password)
        if(!comparePassword){
            return res.status(401).json({success,msg:"Email or Password Error"})
        }
        const data = {
            user:{
                id:user.id 
            }
        }
        const authToken = jwt.sign(data,JWT_SECRET)
        success = true 
        res.status(200).json({success,authToken});
    } catch (error) {
        res.status(401).json({success,msg:"Internal Server Error"})
        console.log(error.message)
    } 
})

// ROUTE TO EDIT THE FIELDS 
router.put('/edit', FetchUser ,[
    body('fullName').isLength({min:1}),
    body('phone').isLength({min:1}),
] ,async (req,res)=>{
    const id = req.user.id 
    let success = false 
    try {
        let user = await Users.findByIdAndUpdate(id)
        if(!user){;
            return res.status(400).json({success:success , msg:"User Not Found"})
        }
        const {fullName,phone} = req.body
        user.fullName = fullName 
        const updatedUser = await user.save() 
        res.status(200).json({success:true , user:updatedUser})
    } catch (error) {
        res.status(401).json({success,msg:"Internal Server Error"})
        console.log(error.message)
    }
}) 

// route for getting all the user info 
router.get('/getall',async(req,res)=>{
    const users = await Users.find();
    if(users){
        res.status(200).json(users);  
    }
    else{
        res.status(401).json("Internal server error ")
    }
})

module.exports  = router 