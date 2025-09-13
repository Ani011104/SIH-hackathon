const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const AuthRouter = require('./routes/auth')
const AddressRouter = require('./routes/address')
const UserRouter = require('./routes/user')

const app = express()
app.use(express.json())

dotenv.config()
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to Mongodb successfully"))
    .catch(() => console.log("Connection failed"));

app.use('/auth', AuthRouter);
app.use('/address', AddressRouter)
app.use('/user', UserRouter)



app.listen(process.env.PORT || 5000  , ()=>{
    console.log(`Server is running on http://localhost:${process.env.PORT || 5000}`)
})