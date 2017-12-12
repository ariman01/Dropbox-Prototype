var mkdir = require('mkdirp');
var jwt = require('jsonwebtoken');
var multer = require('multer');
var filesystem = require('fs');
var mysql = require('./../routes/mysql');
const server_secret_key = "aqswdefrgthyjukilop";

function createDirectory(path, callback){
  mkdir(path,function(err){
    if(err){
      console.log("Failed to create directory: ",path);
      callback(false);
    }else{
      console.log("Directory created",path);
      callback(true);
    }
  });
}

function checkUserLoggedIn(req){
  var isLoggedIn = false;
  const tokenheader = req.body.servertoken | req.headers.servertoken;
  let jwttoken;
  if (tokenheader) {
   jwttoken = tokenheader.split(' ')[0];
  }

  if (jwttoken) {
   jwt.verify(jwttoken, server_secret_key, function(err, decoded){
       if (!err) {
         // Do Sql verification
          isLoggedIn = true
          //console.log("No Error1 in token retrieval",decoded.username);
      }
      console.log(err);
    });
  }
  return isLoggedIn;
}
function checkLoggedInUser(req,res,next){
  const tokenheader = req.body.servertoken || req.headers['servertoken'];

  if (tokenheader) {
   jwt.verify(tokenheader, server_secret_key, function(err, decoded){
       if (!err) {

          req.body.uidfromtoken = decoded.uid

          req.body.uidfromtoken = decoded.uid;
          next();
      }else{
        res.status(401).json("Unauthorized user !!!");
      }

    });
  }else{
    res.status(401).json("Unauthorized user !!!");
  }
}

function deleteHelper(path,isFile,isGrp,callbackFunction){
  console.log("deleteHelper",path,"isFile :",isFile);
  if(!isFile || isGrp){
    filesystem.rmdir(path,function(error){
      if(!error){
        callbackFunction(true);
      }else{
        callbackFunction(false);
      }
    });
  }else{
    filesystem.unlink(path,function(error){
      if(!error){
        callbackFunction(true);
        console.log("deleted ",path);
      }else{
        callbackFunction(false);
      }
    });
  }
}

function getUserlistToReceiveUpdate(path,callbackFunction){
  var userid_set = new Set();
  var splitpath = path.split("/");
  let search_path = '';
  let query = "select user_id,path from (user_userfiledir inner join "+
              "userfiledir on user_userfiledir.userfiledir_id = userfiledir.id)";
  mysql.executeSQLQuery(query,function(error,result){
    if(!error){
      for(var eachpattern in splitpath){
        search_path += (search_path)?("/"+splitpath[eachpattern]):splitpath[eachpattern];
        console.log("search_path: ",search_path);
        for (var index in result){

          let re = new RegExp('^'+search_path+'$');
          
          if(re.test(result[index].path)){
            userid_set.add(result[index].user_id);
          }
        }
      }
      console.log(userid_set);
       callbackFunction(null, Array.from(userid_set));
    }
  });
}
function uniounList(list1, list2){
  var result = new Set();
  for(var index in list1){
    result.add(list1[index]);
  }
  for(var index in list2){
    result.add(list2[index]);
  }
  return Array.from(result);
}

exports.uniounList = uniounList;
exports.getUserlistToReceiveUpdate = getUserlistToReceiveUpdate;
exports.deleteHelper = deleteHelper;
exports.createDirectory = createDirectory;
exports.server_secret_key = server_secret_key;
exports.checkUserLoggedIn = checkUserLoggedIn;
exports.checkLoggedInUser = checkLoggedInUser;
