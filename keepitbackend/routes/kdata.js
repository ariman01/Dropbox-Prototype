var express = require('express');
var router = express.Router();
var mkdir = require('mkdirp');
var path = require('path');
var mysql = require('./mysql');
var utils = require('./../util/utils');
var kafka = require('./../kafka/client');
var ejs = require('ejs');
const all_userhome = path.join(__dirname,'./../../user_home_directory');

router.get('/getfiledirlist', utils.checkLoggedInUser,function(req, res, next) {
  let date = new Date().toISOString().slice(0,10);
  let user_id = req.body.uidfromtoken;
  let getfilequery = "select user_id, path,fav, isFile,isGrp, owner, id as file_id from (user_userfiledir inner "+
  "join userfiledir on user_userfiledir.userfiledir_id = userfiledir.id) where user_id=" + user_id;
  const userfiles = [];
  mysql.executeSQLQuery(getfilequery, function(err, result){
    if(!err){
      result.map((file)=>{
        userfiles.push({
          path:file.path,
          fav:file.fav === 'true'?true:false,
          isFile:file.isFile === 'true'?true:false,
          isGrp:file.isGrp === 'true'?true:false,
          owner:(file.owner ===user_id )?true:false
        });
      });
      res.status(201).json({ files:userfiles});
    }
  });
});

router.post('/upload',function(req,res){
  //console.log("req.files.userfile",req.files);
  if(req.files.userfile){
    let data = req.files.userfile;
    let filename = data.name;
    let username = req.body.username;
    let usrcurrentdir = req.body.currentdir;
    kafka.make_request('upload',
      { username:username,
        filename:filename,
        filebuffer:data.data,
        currentdir:usrcurrentdir
      }, function(err,result){
            if(!err){
              console.log("[Node Server] upload kafka result ",result);
              res.status(201).json(result);
            }else{
              res.status(401).json({});
            }
        });
  }else {
    res.status(400).json("File not found or file not choosen by user !!!");
  }
});

router.post('/newdir',utils.checkLoggedInUser,function(req,res){
  console.log("req.body.path:",req.body.path);
  let des_path = req.body.path;
  let user_id = req.body.uidfromtoken;
  kafka.make_request('createDir',
    { username:user_id,
      path:des_path
    }, function(err,result){
      if(!err){
        res.status(201).json("Directory Created Successfully !!!");
      }else{
        res.status(401).json("Failed to create Directory ");
      }
    });
});

router.post('/star', utils.checkLoggedInUser, function(req,res){
  console.log("start request: ",req.body.path);
  let des_path = req.body.path;
  let user_id = req.body.uidfromtoken;
  let isstar = req.body.star;
  kafka.make_request('setFav',
    { username:user_id,
      path:des_path,
      status:isstar
    }, function(err,result){
      if(!err){
        res.status(201).json("Star updated successfully !!!");
      }else{
        res.status(400).json("Error while updating star !!!");
      }
  });
});

router.post('/delete',utils.checkLoggedInUser, function(req,res){
  console.log("Inside delete:");
  let des_path = req.body.data.path;
  let isFile = req.body.data.isFile;
  let isGrp = req.body.data.isGrp
  let user_id = req.body.uidfromtoken;
  kafka.make_request('delete',
    { username:user_id,
      path:des_path,
      isFile:isFile,
      isGrp:isGrp
    }, function(err,result){
      if(!err){
        res.status(201).json("File deleted successfully !!!");
      }else{
        res.status(400).json("Error while deleting!!!");
      }
   });
});

router.post('/sharedata',function(req, res, next) {
  let data_path = req.body.shareData.path;
  let user_id = req.body.uidfromtoken;
  let users = req.body.users;
  console.log("download_path :",data_path," users",users);
  kafka.make_request('sharedata',
    { username:user_id,
      path:data_path,
      users:users,
      isFile:req.body.shareData.isFile,
      isGrp:req.body.shareData.isGrp
    }, function(err,result){
      if(!err){
        res.status(201).json("File deleted successfully !!!");
      }else{
        res.status(400).json("Error while deleting!!!");
      }
   });
});

router.post('/download',function(req, res, next) {
  let download_path = path.join(all_userhome,req.body.path);
  console.log(download_path);
  res.download(download_path);
});

router.get('/activityreport',utils.checkLoggedInUser,function(req, res, next) {
  let user_id = req.body.uidfromtoken;
  let activity_query = "select * from activity_table where user_id ="+user_id;
  let report = [];
  mysql.executeSQLQuery(activity_query, function(err,result){
    if(!err){

        result.map((file)=>{
          let aName = file.path.split("/");
            report.push({
            activity:file.activity,
            date:file.date,
            filename:aName[aName.length -1]
          });
        });
        res.status(201).json({report:report})
      //}
    }else{
      res.status(401).json("Could not retrieve activity report !!!");
    }
  });
});

router.post('/creategroup',utils.checkLoggedInUser,function(req, res, next) {
  console.log("creategroup req.body['path']: ",req.body['path']);
  let grp_path = req.body['path'];
  let owner = req.body.uidfromtoken;
  let users = req.body.userlist.split(",");
  kafka.make_request('creategroup',
    { owner:owner,
      path:grp_path,
      members:users
    }, function(err,result){
      if(!err){
        res.status(201).json("Group Created !!!");
      }else{
        res.status(401).json("Failed to create group !!!");
      }
   });
});

router.post('/getgrpmembers',utils.checkLoggedInUser, function(req,res){

  let grp_path = req.body.data.path;
  let user_id = req.body.uidfromtoken;
  kafka.make_request('getgrpmembers',
    { owner:user_id,
      path:grp_path
    }, function(err,result){
      if(!err){
        //res.status(201).json({members:member_emails,grp:{id:file_id,path:grp_path}});
        res.status(201).json(result);
      }else{
        res.status(401).json("Error !!! ");
      }
   });
});

router.post('/deletegrpmem',utils.checkLoggedInUser, function(req,res){
  console.log("Inside deletegrmem: req body",req.body);
  let grp_path = req.body.path;
  let mem_email = req.body.email;
  let user_id = req.body.uidfromtoken;
  kafka.make_request('deletegrpmem',
    { owner:user_id,
      path:grp_path,
      member:mem_email
    }, function(err,result){
      if(!err){
        res.status(201).json("Group Member Deleted !!!");
      }else{
        res.status(401).json("Error while deleting group member !!! ");
      }
   });
});

router.post('/addgrpmem',utils.checkLoggedInUser, function(req,res){
  console.log("Inside addgrpmem: req body",req.body);
  let path = req.body.grp.path;
  let users = req.body.users;
  let user_id = req.body.uidfromtoken;
  kafka.make_request('addgrpmem',
    { path:path,
      users:users,
      owner:user_id
    }, function(err,result){
      if(!err){
        //res.status(201).json({members:member_emails,grp:{id:file_id,path:grp_path}});
        res.status(201).json("Group Member added !!!");
      }else{
         res.status(401).json("Failed to Add Member");
      }
   });
});

module.exports = router;
