var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cors = require('cors');
var passport = require('passport');
var mongoose = require('mongoose');

var config = require('./config/database');

mongoose.connect(config.database);
mongoose.connection.on('error',(err)=> {
	console.log("Database error"+err);
});

var app = express();

var users =  require('./routes/users');

//Port Declaration
var port = 3003;


// CORS Middleware
app.use(cors());


//Set static Folder
app.use(express.static(path.join(__dirname,'public')));

//Body parser Middleware
app.use(bodyParser.json());

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);


app.use('/users',users);

app.get('/',(req,res)=>{
	res.send("Invalid page");
});


app.get('*',(req, res)=>{
	res.sendFile(path.join(__dirname,'public/index.html'));
})

//Start server
app.listen(port, ()=>{
	console.log("Server started");
})