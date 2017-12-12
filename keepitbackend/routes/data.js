var express = require('express');
var router = express.Router();
var mkdir = require('mkdirp');
var path = require('path');
var mysql = require('./mysql');
var utils = require('./../util/utils');
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


router.post('/upload1',function(req,res){
  console.log("req.files.userfile",req.body);
  if(req.files.userfile){
    let data = req.files.userfile,
    filename = data.name,
    username = req.body.username,
    usrcurrentdir = req.body.currentdir;
    var userQuery = "select * from user where email='"+username+"'";
    mysql.executeSQLQuery(userQuery, function(err, result) {
      if(err){
        res.status(400).json( "sql error !!!");
      }else{
        if(result.length > 0){
          let user_id = result[0].id;
          let email = result[0].email;
          let rel_filepath = path.join(result[0].homedir,usrcurrentdir,filename);
          let des_path = path.join(__dirname,'./../user_home_directory',rel_filepath);
          data.mv(des_path,function(err){
            if(err){
              res.status(400).json("Upload Failed !!!");
            }else {
              let date = new Date().toISOString().slice(0,10);
              let filetableUpdate = "insert into userfiledir (path, owner, createddate) values ('"+
              rel_filepath + "','" + result[0].id + "','" + date +"')";
              mysql.executeSQLQuery(filetableUpdate, function(err, result) {
                if(!err){
                  let filequery = "select * from userfiledir where path = '" + rel_filepath + "'";
                  mysql.executeSQLQuery(filequery, function(err, result) {
                    if(!err && result.length > 0){
                      let file_id = result[0].id;

                      utils.getUserlistToReceiveUpdate(rel_filepath,function(error,resultList){
                        if(!error){
                          let user_ids = utils.uniounList([user_id],resultList);
                          let values = '';
                          for (var index in user_ids){
                            values += (values)?",("+user_ids[index]+","+file_id+")":"("+user_ids[index]+","+file_id+")";
                          }
                          let file_usermapQuery = "insert into user_userfiledir (user_id,userfiledir_id) values "+
                          values;
                          mysql.executeSQLQuery(file_usermapQuery, function(err, result){
                            if(!err){
                              let gpname = rel_filepath.split("/");
                              let date = new Date().toISOString().slice(0,10);
                              let activityupdate = "insert into activity_table (user_id,email,activity,date,path) "+
                              "values ('"+user_id+"','"+email+"','File Uploaded','"+date+"','"+gpname[gpname.length -1]+"')";
                              mysql.executeSQLQuery(activityupdate,function(error,result){
                                if(!error){
                                  res.status(201).json("Upload Successfull !!!");
                                }else{
                                  res.status(401).json("Failed to Upload!!!");
                                }
                              });

                            }else{
                              res.status(401).json("file_usermapQuery query failed");
                            }
                          });
                        }else{
                          res.status(401).json("Error !!!");
                        }
                      });

                   }else{
                     res.status(401).json("filequery query failed");
                   }

                 });
               }else{
                 res.status(401).json("userfiledir query failed");
               }
             });
            }
          });
        }else{
          console.log("Username Does not exist !!!");
          res.status(400).json("Username Does not exist !!!");
        }
      }
    });
  }
  else {
    res.status(400).json("File not found or file not choosen by user !!!");
  }
});


router.post('/newdir',utils.checkLoggedInUser,function(req,res){
  console.log("req.body.path:",req.body.path);
  let des_path = req.body.path;
  let user_id = req.body.uidfromtoken;
  let userhome = "select * from user where id="+user_id;
  mysql.executeSQLQuery(userhome, function(err, result){
    if(!err){
      let email = result[0].email;
      let home = result[0].homedir;
      let dir_path = path.join(all_userhome,home,des_path);
      let rel_filepath = path.join(home,des_path);
      utils.createDirectory(dir_path, function(status){
        if(status){

          let date = new Date().toISOString().slice(0,10);
          let filetableUpdate = "insert into userfiledir (path, owner, createddate, isFile) values ('"+
          rel_filepath + "','" + result[0].id + "','" + date +"','false')";
          mysql.executeSQLQuery(filetableUpdate, function(err, result) {
            if(!err){
              let filequery = "select * from userfiledir where path = '" + rel_filepath + "'";
              mysql.executeSQLQuery(filequery, function(err, result) {
                if(!err && result.length > 0){
                  let file_id = result[0].id;

                  utils.getUserlistToReceiveUpdate(rel_filepath,function(error,resultList){
                    if(!error){
                      let user_ids = utils.uniounList([user_id],resultList);
                      let values = '';
                      for (var index in user_ids){
                        values += (values)?",("+user_ids[index]+","+file_id+")":"("+user_ids[index]+","+file_id+")";
                      }
                      let file_usermapQuery = "insert into user_userfiledir (user_id,userfiledir_id) values "+
                      values;
                      mysql.executeSQLQuery(file_usermapQuery, function(err, result){
                        if(!err){
                          let dirName = rel_filepath.split("/")
                          let activity_query = "insert into activity_table (user_id,email,activity,date,path) "+
                          "values('"+user_id+"','"+email+"','Created Directory','"+date+"','"+dirName[dirName.length - 1]+"')";
                          console.log("activity_query:",activity_query);
                          mysql.executeSQLQuery(activity_query, function(err,result){
                            if(!err){
                              res.status(201).json("Directory Created Successfully !!!");
                            }else{
                              res.status(401).json("Failed to update Activity, Directory Created");
                            }
                          });

                        }else{
                          res.status(401).json("file_usermapQuery query failed");
                        }
                      });
                    }else{
                      res.status(401).json("Error !!! ");
                    }
                  });



               }else{
                 res.status(401).json("filequery query failed");
               }

             });
           }else{
             res.status(401).json("userfiledir query failed");
           }
         });
        }else{
          res.status(400).json("Directory creation Failed !!!");;
        }
      });
    }else{
      res.status(400).json("Failed to create Directory !!!");
    }
  });
});


router.post('/star',utils.checkLoggedInUser, function(req,res){
  let des_path = req.body.path;
  let user_id = req.body.uidfromtoken;
  let isstar = req.body.star;
  let userhome = "select * from user where id="+user_id;

      let filequery = "select * from userfiledir where path = '"+des_path+"'";

      mysql.executeSQLQuery(filequery, function(err, result){
        if(!err){
          let fileid = result[0].id;
          let file_user_map_query = "update user_userfiledir set fav = '" + isstar +"' where "+
          "user_id = '" + user_id + "' and userfiledir_id = '" + fileid + "'";

          mysql.executeSQLQuery(file_user_map_query, function(err, result){
            if(!err){

              res.status(201).json("Star updated successfully !!!");
            }else{
              res.status(400).json("Error while updating star !!!");
            }
          })
        }else{
          res.status(400).json("Failed to star");
        }
      });

});


router.post('/delete',utils.checkLoggedInUser, function(req,res){
  console.log("Inside delete:");
  let des_path = req.body.data.path;
  let isFile = req.body.data.isFile;
  let isGrp = req.body.data.isGrp
  let user_id = req.body.uidfromtoken;
  let userfile_id_query = "select * from userfiledir where path = '"+des_path + "'";
  let deleteQuery = "delete from userfiledir where path = '"+des_path + "'";
  let abspath = path.join(all_userhome,des_path);
  utils.deleteHelper(abspath,isFile,isGrp,function(status){
    if(status){

      mysql.executeSQLQuery(userfile_id_query,function(err, result){
        if(!err){
          if(result.length > 0){
            let delete_userfiledir_query = "delete from user_userfiledir where userfiledir_id="+result[0].id;
            mysql.executeSQLQuery(delete_userfiledir_query,function(err, result){
              if(!err){
                mysql.executeSQLQuery(deleteQuery, function(err, result){
                  if(!err){
                    let action = isFile?"File Deleted":"Directory Deleted";
                    let date = new Date().toISOString().slice(0,10);
                    let activity_query = "insert into activity_table (user_id,activity,date,path) "+
                    "values('"+user_id+"','"+action+"','"+date+"','"+des_path+"')";
                    mysql.executeSQLQuery(activity_query, function(err,result){
                      if(!err){
                        res.status(201).json("Successfully deleted !!!");
                      }else{
                        res.status(401).json("Failed to update Activity,",action);
                      }
                    });

                  }else{
                    res.status(400).json("Failed to delete the directory !!!");
                  }
                });

              }else{
                res.status(401).json("Delete failed due to sql update")
              }
            });
          }else{
            res.status(401).json("Delete failed due to sql update");
          }
        }
      });
    }else{
      res.status(400).json("Failed to delete the directory !!!");
    }

  });

});



router.post('/sharedata',function(req, res, next) {
  let data_path = req.body.shareData.path;
  let users = req.body.users.split(",");
  console.log("download_path :",data_path," users",users);
  let file_idQuery = "select * from userfiledir where path ='"+data_path+"'";
  mysql.executeSQLQuery(file_idQuery,function(err,result){
    if(!err){
      let file_id = result[0].id;
      let userstr = '';

      users.map((user)=>{
        userstr+=(userstr)?",'"+user+"'":"'"+user+"'";
      });
      let user_idsQuery = "select * from user where email in ("+userstr+")";
      mysql.executeSQLQuery(user_idsQuery,function(err,result){
        if(!err){
          console.log("result:",result);
          if(result.length != users.length){
            res.status(400).json("One or more user does not exists !!!");
          }else{
            let query = "insert into user_userfiledir (user_id,userfiledir_id) values ";
            let values = '';
            for (var index in result){
              values += (values)?",("+result[index].id+","+file_id+")":"("+result[index].id+","+file_id+")";
            }
            query +=values;
            mysql.executeSQLQuery(query,function(err,result){
              if(!err){
                res.status(201).json("File Shared Successfully !!!");
              }else{
                res.status(401).json("Failed to shared");
              }
            });
          }
        }else{
          res.status(401).json("One or more user does not exists !!!");
        }
      });
    }else{
      res.status(401).json("Could not find the share data");
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

  let grp_path = req.body['path'];

  let owner = req.body.uidfromtoken;
  let users = req.body.userlist.split(",");

  let userhomequery = "select * from user where id="+owner;
  mysql.executeSQLQuery(userhomequery, function(err, result){
    if(!err){
      let email = result[0].email;
      grp_path = path.join(result[0].homedir,grp_path);

      let userstr = '';
      users.map((user)=>{
        userstr+=(userstr)?",'"+user+"'":"'"+user+"'";
      });
      let user_idsQuery = "select * from user where email in ("+userstr+")";
      mysql.executeSQLQuery(user_idsQuery,function(error,result){
        if(!error){
          let user_ids = [];
          user_ids.push(owner);
          for (var index in result){
            user_ids.push(result[index].id);
          }
          utils.getUserlistToReceiveUpdate(grp_path,function(error,resultList){

            user_ids = utils.uniounList(user_ids,resultList);
            utils.createDirectory(path.join(all_userhome,grp_path),function(status){
              if(status){
                let userfiledir_query = "insert into userfiledir (path,isGrp,owner) values ('"+
                grp_path+"','true','"+owner+"')";
                mysql.executeSQLQuery(userfiledir_query,function(error,result){
                  if(!error){
                    let grp_id_query = "select id from userfiledir where path ='"+grp_path+"'";
                    mysql.executeSQLQuery(grp_id_query,function(error,result){
                      if(!error){
                        let grp_id = result[0].id;
                        let values = '';
                        for (var index in user_ids){
                          values += (values)?",("+user_ids[index]+","+grp_id+")":"("+user_ids[index]+","+grp_id+")";
                        }

                        let user_userfiledir_query = "insert into user_userfiledir (user_id,userfiledir_id) values "+
                        values;
                        mysql.executeSQLQuery(user_userfiledir_query,function(error,result){
                          if(!error){
                            let gpname = grp_path.split("/");
                            let date = new Date().toISOString().slice(0,10);
                            let activityupdate = "insert into activity_table (user_id,email,activity,date,path) "+
                            "values ('"+owner+"','"+email+"','Group Created','"+date+"','"+gpname[gpname.length -1]+"')";
                            mysql.executeSQLQuery(activityupdate,function(error,result){
                              if(!error){
                                res.status(201).json("Group Created !!!");
                              }else{
                                res.status(401).json("Failed to create group !!!");
                              }
                            });

                          }else{
                            res.status(401).json("Error!!!");
                          }
                        });
                      }
                    });
                  }
                });
              }else{
                // need to delete created user to maintain fallback mechanism
                res.status(400).json("Failed to create user home directory");
              }
            });
          });
        }
      });

    }else{
      res.status(404).json("Error");
    }
  });

});


router.post('/getgrpmembers',utils.checkLoggedInUser, function(req,res){

  let grp_path = req.body.data.path;
  let user_id = req.body.uidfromtoken;

  let fileidquery = "select id from userfiledir where path = '"+grp_path + "'";
  mysql.executeSQLQuery(fileidquery,function(error,result){
    if(!error){
      let file_id = result[0].id;

      let getmember_query = "select * from (user_userfiledir inner join userfiledir on "+
      "user_userfiledir.userfiledir_id = userfiledir.id) where userfiledir_id = "+file_id;
      mysql.executeSQLQuery(getmember_query, function(error,result){
        let members = '';
        if(!error){
          result.map((member)=>{
            if(member.user_id != user_id){
              members+=(members)?(","+member.user_id):member.user_id;
            }
          });
          if(members){
            let members_email = "select id,email from user where id in ("+members+")";
            mysql.executeSQLQuery(members_email,function(error,result){
              if(!error){
                let member_emails =[];
                result.map((mem)=>{
                  member_emails.push({email:mem.email,grp_id:file_id,user_id:mem.id,path:grp_path});
                });
                res.status(201).json({members:member_emails,grp:{id:file_id,path:grp_path}});
              }else{
                res.status(401).json("Error !!! ");
              }
            });
          }else{
            res.status(201).json({members:[],grp:{id:file_id,path:grp_path}})
          }

        }else{
          res.status(401).json("Error !!! ");
        }
      });
    }else{
      res.status(401).json("Error !!!");
    }
  });
});

router.post('/deletegrpmem',utils.checkLoggedInUser, function(req,res){
  console.log("Inside deletegrmem: req body",req.body);
  let grp_id = req.body.grp_id;
  let mem_id = req.body.user_id;
  let user_id = req.body.uidfromtoken;
  let memdelete_query = "delete from user_userfiledir where user_id = "+mem_id+" and userfiledir_id ="+grp_id;
  mysql.executeSQLQuery(memdelete_query,function(error,result){
    if(!error){
      let gpname = req.body.path.split("/");
      let date = new Date().toISOString().slice(0,10);
      let activityupdate = "insert into activity_table (user_id,activity,date,path) "+
      "values ('"+user_id+"','Group Member Deleted','"+date+"','"+gpname[gpname.length -1]+"')";
      mysql.executeSQLQuery(activityupdate, function(error,result){
        if(!error){
          res.status(201).json("Group Member Deleted !!!");
        }else{
          res.status(401).json("Error !!! ");
        }
      });

    }else{
      res.status(401).json("Error !!! ");
    }
  });
});


router.post('/addgrpmem',utils.checkLoggedInUser, function(req,res){
  console.log("Inside addgrpmem: req body",req.body);
  let grp_id = req.body.grp.id;
  let users = req.body.users.split(",");
  let user_id = req.body.uidfromtoken;
  let userstr = '';
  users.map((user)=>{
    userstr+=(userstr)?",'"+user+"'":"'"+user+"'";
  });
  let user_idsQuery = "select * from user where email in ("+userstr+")";
  mysql.executeSQLQuery(user_idsQuery,function(err,result){
    if(!err){
      console.log("result:",result);
      if(result.length != users.length){
        res.status(400).json("One or more user does not exists !!!");
      }else{
        let query = "insert into user_userfiledir (user_id,userfiledir_id) values ";
        let values = '';
        for (var index in result){
          values += (values)?",("+result[index].id+","+grp_id+")":"("+result[index].id+","+grp_id+")";
        }
        query +=values;
        mysql.executeSQLQuery(query,function(err,result){
          if(!err){
            let gpname = req.body.grp.path.split("/");
            let date = new Date().toISOString().slice(0,10);
            let activityupdate = "insert into activity_table (user_id,activity,date,path) "+
            "values ('"+user_id+"','Group Member Added','"+date+"','"+gpname[gpname.length -1]+"')";
            mysql.executeSQLQuery(activityupdate, function(error,result){
              if(!error){
                res.status(201).json("Group Member added !!!");
              }else{
                res.status(401).json("Error !!! ");
              }
            });
          }else{
            res.status(401).json("Failed to Add Member");
          }
        });
      }
    }else{
      res.status(401).json("One or more user does not exists !!!");
    }
  })
});


module.exports = router;
