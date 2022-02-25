const mongoose = require('mongoose')
const MONGO_URL = process.env.MONGO_URL 
const connectToMongo = () => {
    mongoose.connect(MONGO_URL,() => {
        console.log('Connected To Database'); 
    })
}
module.exports = connectToMongo 