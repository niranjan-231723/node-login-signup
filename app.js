require("dotenv").config();
console.log(process.env.GOOGLE_CLIENT_ID)
const { default: mongoose } = require("mongoose");
const cookieParser = require("cookie-parser");
const path =require("path")
const routes=require("./routes/routes")
const  connection_string="mongodb+srv://niranjanalgos_db_user:nNJLmP9aToygr6La@niranjan.74ycqjj.mongodb.net/?appName=NIRANJAN"
const  express=require("express");

const app=express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.set("view engine","ejs")
app.use(routes)
app.use(express.static(path.join(__dirname,"public"))) 


mongoose.connect(connection_string).then(()=>{app.listen(5000)}).catch((err)=>{console.log(err.message)})






// "Whatever is inside my public folder, make it directly 
// accessible on the website — without me having to write a route for each file."









