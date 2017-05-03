var JwtStratey = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var User = require('../models/user');
var config = require('../config/database');


module.exports = function(passport){
	let opts = {};
	opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
	opts.secretOrKey = config.secret;
	passport.use(new JwtStratey(opts,(jwt_payload,done) => {

	//	console.log(jwt_payload);
		User.getUSerById(jwt_payload._doc._id, (err,user) =>{
			if(err)
			{
				return done(err,false);
			}	
			if(user){
				return done(null,user);
			}
			else{
				return done(null,false);
			}
		});
	}));
}

