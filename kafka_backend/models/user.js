var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  firstname:{
    type:String
  },
  lastname:{
    type:String
  },
  email:{
    type:String
  },
  password:{
    type:String
  },
  home:{
    type:String
  },
  education:{
    type:String
  },
  interest:{
    type:String
  },
  contact:{
    type:String
  }
});

const Users = mongoose.model('users',userSchema);


function addNewUser(userdetail, callback){
    console.log("addNewUser:",userdetail);
    userdetail.save(callback);
}

function getUser_Id(id, callback){
	Users.findById(id, callback);
}

function searchUser(email, callback){
	var query = {email: email};
	Users.findOne(query, callback);
}


module.exports.addNewUser = addNewUser;
module.exports.searchUser = searchUser;
module.exports.getUser_Id = getUser_Id;
module.exports.Users = Users;
