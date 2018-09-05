require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors              =       require('cors'); 

let router = express.Router();
const bodyParser= require('body-parser');
app.use(bodyParser());
const mongoose = require('mongoose');

mongoose.connect(process.env.mongodbConnectionString,function(err){
    if(err)
    console.log(err);
    else
    console.log('connected..')
});



//Using CORS

app.use(cors());
// app.use(cors({origin: 'https://admin.takeup.in'}));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    next();
});

// Custom dependencies
const apiRoutes = require('./routes/api');


// Routes setup
app.use('/api', apiRoutes);


app.get("/",(req,res)=>{
    res.send("<h3>Har Har Mahadev<\h3>")
})
// app.use('/routes',root);
app.listen(process.env.PORT || 5000,function(req,res){
   
    console.log('server is runnig on port 3500');
});

module.exports = router;
