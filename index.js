const express = require('express'); //requiring instance of express js
const app = express();

require('dotenv').config(); // load config from env file
const PORT = process.env.PORT || 4000;

// Cookie-parser
const cookieParser = require('cookie-parser'); //cookie-parser ka use cookie ko parse karne ke liye use karte hai
app.use(cookieParser());

// middleware to parse json request body
app.use(express.json());

// connect to the database
require("./config/database").connect(); 

// importing routes and mount it
const user = require('./routes/user'); //import route
app.use('/api/v1',user); //mount route

// Server activitation
app.listen(PORT,()=>{
    console.log(`App is listening at ${PORT}`);
})  

//default route
// app.get("/",(req,res)=>{
//     res.send("<h1> sign up </h>");
// })

