var express = require('express');
var router = express.Router();
var passport = require('passport');
var jwt = require('jsonwebtoken');

var User = require("../models/user");

var config = require('../config/database');

//REgister
router.post('/register',(req,res,next)=>{
	let newUser = new User({
		name:req.body.name,
		email:req.body.email,
		username:req.body.username,
		password:req.body.password
	});

	User.addUser(newUser,function(err,user){
		if(err){
			res.json({success: false, msg:"Failed to Register user"});
			console.log(err);
		}else{

			res.json({success: true, msg:"Registered user"});
		}
	});

});



//Authenticate
router.post('/auth',(req,res,next)=>{
	var username = req.body.username;
	var password = req.body.password;

	User.getUSerByUsername(username, (err,user) =>{
		if(err) throw err;
		if(!user){
			return res.json({success: false,msg:"User not found"});
		}

		User.comparePassword(password, user.password,(err, isMAtch) =>{
			if(err) throw err;
			if(isMAtch){
				var token = jwt.sign(user, config.secret,{
					expiresIn : 604800 //1 week
				});
				res.json({
					success:true,
					token: 'JWT ' +token,
					user: {
						id: user._id,
						name:user.name,
						username:user.username,
						email:user.email
					}
				});
			}else{
				return res.json({success: false,msg:"Wrong password"});
			}
		});
	});
});

// Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  res.json({user: req.user});
});




module.exports = router;