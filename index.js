const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const config = require('./config')
const userRouter = require('./route/user')
const roleRouter = require('./route/role')

console.log(process.env.NODE_ENV)
console.log(process.env.NODE_ENV === 'development')
console.log(config.mongoUri)

const app = express()
const port = process.env.port || config.port

app.use(express.static('storage'))
app.use(bodyParser.json())
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
})
app.use('/jetpack/user', userRouter)
app.use('/jetpack/role', roleRouter)

mongoose.connect(config.mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('MOngoDB Connected')
    app.listen(port)
    console.log('listen port: ' + port)
}).catch((e) => {
    console.log(e)
})
