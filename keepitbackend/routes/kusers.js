var express = require('express');
var jwt = require('jsonwebtoken');
var path = require('path');
var utils = require('./../util/utils');
var mysql = require('./mysql');
var ejs = require('ejs');
var bcrypt = require('bcrypt');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var connection =  new require('./../kafka/Connection');
var kafka = require('./../kafka/client');
var router = express.Router();
const saltRnd = 3;

passport.use('login',new LocalStrategy(
  function(username, password, done) {
    console.log("LocalStrategy Username: ",username,"password: ",password);
    let res_result = {message:'',
                      servertoken:'',
                      status:401
                     };
      kafka.make_request('signin',{"username":username}, function(err,result){
        if(err){
          throw err;
        }else{
          //console.log("login result:",result );
          if(result){
            if(bcrypt.compareSync(password, result.password)){
              const server_token = jwt.sign({uid:result.email},utils.server_secret_key);
              res_result.servertoken = server_token;
              res_result.userinfo = {firstname:result.firstname,
                                     username:result.email
                                    };
              res_result.message = "User logged in ... ";
              res_result.status = 201;
            }else{
              res_result.message = "Wrong password !!!";
            }
            done(null,res_result);
          }else{
            done(null,false);
          }
        }
      });
 }));

 router.post('/login', function(req, res, next) {
   passport.authenticate('login', function(err, result) {
       if(!err && result.status == 201) {
         //console.log("[Node Backend] login resuest result: ", result);
         return res.status(201).json(result);

       }else{
         return res.status(401).json({status:401,userinfo:null});
       }

   })(req, res);

  });

router.get('/getfiledirlist',utils.checkLoggedInUser,function(req, res, next) {

   let user_id = req.body.uidfromtoken;
   const userfiles = [];
   console.log("[Node Backend] getfiledirlist resuest to kafka:, username:",user_id);
   kafka.make_request('getfiledirlist',{"username":user_id}, function(err,result){
     if(!err){
       result.map((file)=>{
         userfiles.push({
           path:file.path,
           fav:file.isFav,
           isFile:file.isFile,
           isGrp:file.isGrp,
           owner:file.owner
         });
       });
       res.status(201).json({ files:userfiles,status:201});
     }
   });
 });

router.post('/signup',function(req, res, next){
   let res_result = {message:'',
                     servertoken:''
                    };
    let userinfo = {};
    userinfo.firstName = req.body.firstname;
    userinfo.lastName = req.body.lastname;
    userinfo.userName = req.body.username;
    userinfo.password = req.body.password;
    userinfo.contact = req.body.contactinfo;
    userinfo.education = req.body.education;
    userinfo.interest = req.body.interest;


   kafka.make_request('signup',{"userinfo":userinfo}, function(err,result){
     if(!err){
       //console.log("user signed up ",result);
       res.status(201).json(result);
     }else{
       res.status(401).json({});
     }
   });
 });

 router.get('/activityreport',utils.checkLoggedInUser,function(req, res, next) {
   let user_id = req.body.uidfromtoken;
   let report = [];
   kafka.make_request('activityreport',{"username":user_id}, function(err,result){
     if(!err){
       //console.log("user activityreport ",result);
                result.map((file)=>{
                  let aName = file.path.split("/");
                    report.push({
                    activity:file.activity,
                    date:file.date,
                    filename:aName[aName.length -1]
                  });
                });
                res.status(201).json({report:report})
     }else{
       res.status(401).json("Could not retrieve activity report !!!");
     }
   });
 });

 router.get('/userdata', utils.checkLoggedInUser,function(req, res, next) {
   console.log("/userdata request:",req.body.uidfromtoken);
   let user_id = req.body.uidfromtoken;

   kafka.make_request('userdata',{"username":user_id}, function(err,result){
     if(!err){
       //console.log("userdata ",result);
       res.status(201).json(result)
     }else{
       res.status(401).json("Error in finding user detail");
     }
   });
 });


 module.exports = router;
