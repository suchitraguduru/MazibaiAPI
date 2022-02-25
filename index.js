const dotenv = require('dotenv');
dotenv.config();


// CONNECTING TO MONGO DB Through another file 
const connectToMongo = require('./DB')
connectToMongo();

// INTIALISING EXPRESS 
const express = require('express')
const app = express() 

// MIDDLEWARES 
app.use(express.json())
const cors = require('cors')
app.use(cors())

// ROUTES 
const UserAuthRoutes = require('./routes/Auth/UserAuth')
const MaidAuthRoutes = require('./routes/Auth/MaidAuth')
const ReviewRoutes = require('./routes/Reviews/Review');
app.use('/api/auth/user',UserAuthRoutes)
app.use('/api/auth/maid',MaidAuthRoutes)
app.use('/api/reviews',ReviewRoutes)

const UserGoogleAuth = require('./routes/GoogleAuth/User')
app.use('/api/auth/google-login',UserGoogleAuth)

// login user details 
app.use('/api',require('./routes/loginUser/LoginUser'))


// To Upload Image 
app.use('/api/upload',require('./routes/Upload'))

app.use('/uploads',express.static('uploads'))


// app.use('/api/sms',require('./routes/Auth/Sms'))

// APP LISTENING TO PORT 
const port = process.env.PORT ;
app.listen(port , ()=> console.log(`Listening to PORT : ${port} `))
