var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var config = require('../config/database');


//USer schema

var Userschema = mongoose.Schema({
	name:{
		type:String
	},
	email:{
		type:String,
		required:true
	},
	username:{
		type:String,
		required: true
	},
	password: {
		type:String,
		requied :true
	}
});

var User = module.exports = mongoose.model("User",Userschema);


module.exports.getUSerById = function(id,callback){
	User.findById(id,callback);
}


module.exports.getUSerByUsername = function(username,callback){
	var query = {username:username}
	User.findOne(query,callback);
}


module.exports.addUser = function(newUser, callback){
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
//      if(err) throw err;
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}

module.exports.comparePassword = function(candiatePassword, hash,callback){
	bcrypt.compare(candiatePassword,hash,(err,isMatch) =>{
		if(err){
			console.log(hash);
		}
		callback(null, isMatch);
	});
}