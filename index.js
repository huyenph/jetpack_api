const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const config = require('./config')
const userRoute = require('./route/user')

console.log(process.env.NODE_ENV)
console.log(process.env.NODE_ENV === 'development')
console.log(config.mongoUri)

const app = express()
const port = process.env.port || config.port

app.use(bodyParser.json())
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
})
// app.use('/users', userRoute)

mongoose.connect(config.mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('MOngoDB Connected')
    app.listen(port)
}).catch((e) => {
    console.log(e)
})
