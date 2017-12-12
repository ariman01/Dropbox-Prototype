var userservice = require('./usersservice');
var dataservice = require('./dataservice');
var CONNECTIONPOOL_IMP = false;

function handle_request(topic, data, callback){
    console.log("[Kafka] "+topic+" ,data: ",data);
    if(topic === "signin_req"){
      if(CONNECTIONPOOL_IMP){
        userservice.mconuserSignin(data,callback);
      }else{
        userservice.muserSignin(data,callback);
      }

    }else if(topic === "getfiledirlist_req"){
      dataservice.muserFilesDirs(data, callback);
    }else if(topic === "signup_req"){
      userservice.muserSignUp(data,callback);
    }else if(topic === "upload_req"){
      dataservice.uploadFile(data, callback);
    }else if(topic === "createDir_req"){
      dataservice.createNewDir(data, callback);
    }else if(topic === "delete_req"){
      dataservice.deleteFileDir(data, callback);
    }else if(topic === "setFav_req"){
      dataservice.setFav(data, callback);
    }else if(topic === "sharedata_req"){
      dataservice.shareFilesDir(data, callback);
    }else if(topic === "creategroup_req"){
      dataservice.createGrp(data, callback);
    }else if(topic === "getgrpmembers_req"){
      dataservice.getgrpmembers(data, callback);
    }else if(topic === "deletegrpmem_req"){
      dataservice.deletegrpMember(data, callback);
    }else if(topic === "addgrpmem_req"){
      dataservice.addgrpmem(data, callback);
    }else if(topic === "activityreport_req"){
      dataservice.getUserActivity(data, callback);
    }else if(topic === "userdata_req"){
      userservice.getUserData(data, callback);
    }
}

exports.handle_request = handle_request;
