var express = require('express');
var jwt = require('jsonwebtoken');
var path = require('path');
var utils = require('./../util/utils');
var mysql = require('./mysql');
var ejs = require('ejs');
var bcrypt = require('bcrypt');
var router = express.Router();
const saltRnd = 3;

router.post('/login', function(req, res, next) {

  var username = req.body.username;
  var password = req.body.password;
   var createUserQuery = "select * from user where email='"+username+"'";
   let status = 400;
   let res_result = {message:'',
                     servertoken:''
                    };
   mysql.executeSQLQuery(createUserQuery, function(err, result) {
     if(err){
       console.log(err);
       res_result.message = "sql error !!!";
     }else{

       if(result.length > 0){

         if(bcrypt.compareSync(password, result[0].password)){
           const server_token = jwt.sign({uid:result[0].id},utils.server_secret_key);

           res_result.servertoken = server_token;
           res_result.userinfo = {firstname:result[0].firstname,
                                  username:result[0].email
                                };
           res_result.message = "User logged in ... ";
           status = 201;
         }else{
           res_result.message = "Wrong password !!!";
         }
       }else{
         res_result.message = "Username does not exists !!!";
         console.log("Username Does not exist !!!");
       }
     }
     res.status(status).json(res_result);
   });

});

router.post('/signup',function(req, res, next){
  var firstName = req.body.firstname;
  var lastName = req.body.lastname;
  var userName = req.body.username;
  var password = req.body.password;
  var contact = req.body.contactinfo;
  var education = req.body.education;
  var interest = req.body.interest;
  let res_result = {message:'',
                    servertoken:''
                   };
  bcrypt.hash(password, saltRnd, function(err, hashpassword) {
    if(!err){
      var userhome = firstName + "_" + Date.now();
      var createUserQuery = "insert into user (firstname, lastname, email, password, homedir,contact,education,interest) values ('"+
      firstName + "','" + lastName + "','" + userName + "','" + hashpassword + "','" + userhome +"','"+contact+"','"+education+"','"+interest+"')";

      mysql.executeSQLQuery(createUserQuery, function(err, result){
        if(err){
          var erroro_msg = "Registration failed !!!"
          res.status(400).json(erroro_msg);
        }else{
          var success_msg = "User "+ firstName+" added successfully !!!"
          utils.createDirectory(path.join(__dirname,'./../user_home_directory',userhome),function(status){
            if(status){
              let user_idQuery = "select * from user where email='"+userName+"'";
              mysql.executeSQLQuery(user_idQuery, function(err,result){
                if(!err){
                  const server_token = jwt.sign({uid:result[0].id},utils.server_secret_key);
                  res_result.servertoken = server_token;
                  res_result.userinfo = {firstname:result[0].firstname,
                                         username:result[0].email
                                       };
                  }
                  res.status(201).json(res_result)
              });

            }else{
              res.status(400).json("Failed to create user home directory");
            }
          });
        }
      });
    }
  });
});

router.get('/userdata', utils.checkLoggedInUser,function(req, res, next) {
  let user_id = req.body.uidfromtoken;
  let userdetailQuery = "select firstname,lastname,email,contact,education,interest from user where id="+user_id;
  mysql.executeSQLQuery(userdetailQuery,function(err,result){
    if(!err){
      console.log(result[0]);
      res.status(201).json(result[0]);
    }else{
      res.status(401).json("Error in finding user detail");
    }
  });
});
module.exports = router;
