var mysql = require('./../util/mysql');
var FileDir = require('../models/file_dir');
var Users = require('../models/user');
var path = require('path');
var utils = require('./../util/utils');
var ActivityReport = require('../models/activityreport');
//var file = require('file-system');
var fs = require('fs');
var Buffer =  require('buffer').Buffer;
//const all_userhome = '/Users/oori/Desktop/SanJose/Fall2017/CMPE273/LabAssignment1/KafkaDropBox/DropBox/user_home_directory';
const all_userhome = path.join(__dirname,"../../user_home_directory");
console.log("home1: ",all_userhome);

exports.userFilesDirs = function(data, callback){
  var user_id = data.user_id;
  let getfilequery = "select user_id, path,fav, isFile,isGrp, owner, id as file_id from (user_userfiledir inner "+
  "join userfiledir on user_userfiledir.userfiledir_id = userfiledir.id) where user_id=" + user_id;
   //console.log("getfilequery: ",getfilequery);
   mysql.executeSQLQuery(getfilequery, function(err, result) {
     if(err){
       console.log("[KafKa] Sql error:",err);
     }
    // console.log("sql result:",result)
     callback(err,result);
   });
}

exports.muserFilesDirs = function(data, callback){
  console.log("data: ",data.username);
  var username = data.username;
   FileDir.searchFileDir(username, function(err, result) {
     if(err){
       console.log("[KafKa] muserFilesDirs error:",err);
     }
     callback(err,result);

   });
}

exports.shareFilesDir = function(data, callback){
  let path = data.path;
  let users = data.users.split(",");
  let queries = [];
  users.map((user)=>{
    queries.push({
      path:path,
      owner:false,
      isFile:data.isFile,
      isGrp:data.isGrp,
      email:user
    })
  });
  FileDir.addMultipleFilesDir(queries,function(err,result){
    console.log("addMultipleFilesDir: result",result);
    callback(err,result);
  });
}

exports.setFav = function(data, callback){
  console.log("setFav: ",data);
   FileDir.setFav(data.username, data.path, data.status, function(err, result) {
     if(err){
       console.log("[KafKa] setFav error:",err);
     }else{
       let date = new Date().toISOString().slice(0,10);
       var activity = new ActivityReport.ActivityReport({
         email: data.username,
         activity:"set favourite",
         date:date,
         path:data.path
       });
       ActivityReport.addNewActivity(activity, function(err, result){
         console.log("Succesfully added activity set favourite", result);
       });
     }
     callback(err,result);

   });
}

exports.getgrpmembers = function(data, callback){
    console.log("getgrpmembers: ",data);
    FileDir.searchGrpMem(data.path, function(err, result){
      let member_emails =[];
      result.map((member)=>{
        if(member.email!=data.owner){
          member_emails.push({email:member.email,grp_id:data.path,path:data.path});
        }
      });
        callback(err,{members:member_emails,grp:{id:data.path,path:data.path}});
    });
}

exports.addgrpmem = function(data, callback){
  console.log("addgrpmem: ",data);
  let path = data.path;
  let users = data.users.split(",");
  //let user_id = data.user_id; for activity report
  let queries = [];
  users.map((user)=>{
    queries.push({
      path:path,
      owner:false,
      isFile:false,
      isGrp:true,
      email:user
    })
  });
  FileDir.addMultipleFilesDir(queries,function(err,result){
    callback(err,result);
  });
}

exports.deletegrpMember = function(data, callback){
  console.log("deletegrpMember: ",data);
  let path = data.path;
  let user = data.member;
  FileDir.deleteFileDir({path:path,email:user},function(err,result){
    callback(err,result);

  });
}

exports.createGrp = function(data, callback){
  console.log("createGrp: ",data);
  let gppath = data.path;
  let owner = data.owner;
  let members = data.members+","+owner;
  members = members.split(",");

  //let user_id = data.user_id; for activity report
  Users.searchUser(owner, function(err, result){
    if(!err){
      let owner_home = result.home;
      console.log("owner home: ",owner_home);
      gppath = path.join(owner_home,gppath);
      utils.createDirectory(path.join(all_userhome,gppath),function(status){
        if(status){
          let queries = [];
          members.map((user)=>{
            queries.push({
              path:gppath,
              owner:(user===owner),
              isFile:false,
              isGrp:true,
              email:user
            })
          });
        FileDir.addMultipleFilesDir(queries,function(err,result){
            callback(err,result);
            let date = new Date().toISOString().slice(0,10);
            var activity = new ActivityReport.ActivityReport({
              email: owner,
              activity:"Group Created",
              date:date,
              path:gppath
            });
            ActivityReport.addNewActivity(activity, function(err, result){
              console.log("Succesfully added activity group created", result);
            });
          });

        }else{
            callback(new Error("Error while creating group"),null);
        }
      });
    }
  });
}

exports.uploadFile = function(data, callback){
  console.log("upload: ",data);

  let filename = data.filename,
  username = data.username,
  usrcurrentdir = data.currentdir;
  let filebuffer = data.filebuffer;
  console.log("filebuffer : ",filebuffer, "type: ",typeof filebuffer);
  Users.searchUser(username, function(err, result){
    if(!err){
      let owner_home = result.home;
      console.log("owner home: ",owner_home);
      let rel_filepath = path.join(owner_home,usrcurrentdir,filename);
      let des_path = path.join(all_userhome,rel_filepath);
      var filebuffer1 = Buffer.from(filebuffer);
      //let filebuffer1 = Buffer.from("/Users/oori/Desktop/AJPics.jpg");
      fs.writeFile(des_path, filebuffer1, function(err, result){
        if(!err){
          console.log("File uploaded, path : ",des_path);
          utils.mgetUserlistToReceiveUpdate(rel_filepath, function(err, result){
            if(!err){
              let user_emails = utils.uniounList([username],result);
              let queries = [];
              user_emails.map((user)=>{
                queries.push({
                  path:rel_filepath,
                  owner:(username==user),
                  isFile:true,
                  isGrp:false,
                  email:user
                })
              });
              FileDir.addMultipleFilesDir(queries,function(err,result){
                callback(err,result);
                let date = new Date().toISOString().slice(0,10);
                var activity = new ActivityReport.ActivityReport({
                  email: username,
                  activity:"Upload File",
                  date:date,
                  path:rel_filepath
                });
                ActivityReport.addNewActivity(activity, function(err, result){
                  console.log("Succesfully added activity file uploaded", result);
                });
              });
            }
          });
        }
      });
    }
  });
}

exports.createNewDir = function(data, callback){
  console.log("createNewDir: ",data);
  let dirpath = data.path;
  let owner = data.username;
  Users.searchUser(owner, function(err, result){
    if(!err){
      let owner_home = result.home;
      console.log("owner home: ",owner_home);
      dirpath = path.join(owner_home,dirpath);
      utils.createDirectory(path.join(all_userhome,dirpath),function(status){
        if(status){
          let dirJSON = {
            path:dirpath,
            owner:true,
            isFile:false,
            isGrp:false,
            email:owner
          }
          FileDir.addMultipleFilesDir([dirJSON],function(err,result){
            callback(err,result);
            let date = new Date().toISOString().slice(0,10);
            var activity = new ActivityReport.ActivityReport({
              email: owner,
              activity:"Creating Directory",
              date:date,
              path:dirpath
            });
            ActivityReport.addNewActivity(activity, function(err, result){
              console.log("Succesfully added activity directory creation", result);
            });

          });

        }else{
            callback(new Error("Error while creating new directory"),null);
        }
      });
    }
  });
}

exports.deleteFileDir = function(data, callback){
  let filepath = data.path,
      isFile = data.isFile,
      isGrp = data.isGrp,
      username = data.username;
  let abspath = path.join(all_userhome,filepath);
  utils.deleteHelper(abspath,isFile,isGrp,function(status){
    if(status){
      FileDir.deleteAll({path:filepath}, function(err){
        console.log("[Kafka DataService] err: ",err," result: ");
        callback(err,null);
        let date = new Date().toISOString().slice(0,10);
        let activity_type = isFile?"File Deleted":(isGrp?"Group Deleted":"Directory Deleted");
        var activity = new ActivityReport.ActivityReport({
          email: username,
          activity:activity_type,
          date:date,
          path:filepath
        });
        ActivityReport.addNewActivity(activity, function(err, result){
          console.log("Succesfully added activity directory creation", result);
        });
      });
    }
  });
}

exports.getUserActivity = function(data, callback){
  console.log("getUserActivity");
  let username = data.username;
  ActivityReport.searchActivities(username, function(err, result){
    console.log("[Kafka Server]")
    callback(err, result);
  });

}
