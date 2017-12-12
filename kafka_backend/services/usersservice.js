var mysql = require('./../util/mysql');
var bcrypt = require('bcrypt');
var utils = require('./../util/utils');
var path = require('path');
var jwt = require('jsonwebtoken');
var Users = require('../models/user');
var mcon = require('../models/MongoConnection');
const all_userhome = path.join(__dirname,"../../user_home_directory");
const saltRnd = 3;

exports.muserSignin = function(data, callback){
  var username = data.username;
  var password = data.password;
  Users.searchUser(username, function(err, result){
    console.log("[Kafka] muserSignin: result: ",result);
    callback(err,result);
  });

}

exports.mconuserSignin = function(data, callback){
  var username = data.username;
  var password = data.password;

  mcon.getMongoConnection(function(con,index){
    Users.searchUser(username, function(err, result){
      console.log("[Kafka] muserSignin: result: ",result);
      callback(err,result);
      mcon.closeConnection(index);
    });
  });
}

exports.userSignUp = function(data, callback){

  var firstName = data.userinfo.firstName;
  var lastName = data.userinfo.lastName;
  var userName = data.userinfo.userName;
  var password = data.userinfo.password;
  var contact = data.userinfo.contact;
  var education = data.userinfo.education;
  var interest = data.userinfo.interest;
  let res_result = {};
  bcrypt.hash(password, saltRnd, function(err, hashpassword) {
    if(!err){
      var userhome = firstName + "_" + Date.now();
      var createUserQuery = "insert into user (firstname, lastname, email, password, homedir,contact,education,interest) values ('"+
      firstName + "','" + lastName + "','" + userName + "','" + hashpassword + "','" + userhome +"','"+contact+"','"+education+"','"+interest+"')";
      //console.log("createUserQuery : "+createUserQuery);
      mysql.executeSQLQuery(createUserQuery, function(err, result){
        if(!err){
          utils.createDirectory(path.join(all_userhome,userhome),function(status){
            if(status){
                let user_idQuery = "select * from user where email='"+userName+"'";
                console.log("user_idQuery: ",user_idQuery);
                mysql.executeSQLQuery(user_idQuery, function(err,result){
                  if(!err){
                    const server_token = jwt.sign({uid:result[0].id},utils.server_secret_key);
                    res_result.servertoken = server_token;
                    res_result.userinfo = {firstname:result[0].firstname,
                                           username:result[0].email
                                         };
                    }
                    callback(null, res_result);
                });

            }else{
                    callback("Error while creating directory",null);
            }
          });
        }
      });
    }
  });
}

exports.muserSignUp = function(data,callback){
  console.log("data:muserSignUp",data);
  bcrypt.hash(data.userinfo.password, saltRnd, function(err, hashpassword) {
    if(!err){
      var userhome = data.userinfo.firstName + "_" + Date.now();
      var userdetail = new Users.Users({
        firstname: data.userinfo.firstName,
        lastname:data.userinfo.lastName,
        email:data.userinfo.userName,
        password: hashpassword,
        education:data.userinfo.education,
        home:userhome,
        interest:data.userinfo.interest,
        contact:data.userinfo.contact
      });
      let res_result = {};
      Users.addNewUser(userdetail, function(err, user){
          if(err) {
            console.log("Error :",err);
          }else{
            console.log(user);
            utils.createDirectory(path.join(all_userhome,userhome),function(status){
              if(status){
                  const server_token = jwt.sign({uid:data.userinfo.userName},utils.server_secret_key);
                  res_result.servertoken = server_token;
                  res_result.userinfo = {firstname:data.userinfo.firstName,
                                         username:data.userinfo.userName
                                        };

                  callback(null, res_result);

              }else{
                      callback(new Error("Error while creating directory"),null);
              }
            });
          }
        });
    }
  });
}

exports.getUserData = function(data, callback){
  var username = data.username;
  Users.searchUser(username, function(err, result){
    let res_result = {};
    if(result){
      res_result.firstname = result.firstname,
      res_result.lastname = result.lastname,
      res_result.email = result.email,
      res_result.education = result.education,
      res_result.interest = result.interest,
      res_result.contact = result.contact
    }
    console.log("[Kafka] getUserData: result: ",res_result);
    callback(err,res_result);
  });

}
