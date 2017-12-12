import {updateDisplayData,userLoggedIn,userLoginFail,updateUserDataInfo,userDataScreen} from './../actions/index';
import {setActivityData,activityScreen,updateUserPersonalInfo,displayUserInfo,getGrpEditScreen,updategrpMemInfo} from './../actions/index';
import * as UTIL from './../util/utils';
import FileSaver from 'file-saver';
const server_url = process.env.REACT_APP_CONTACTS_API_URL || 'http://localhost:3000';

const headers = {
    'Accept': 'application/json'
};



export const uploadData= (dataDetails) =>
            fetch(`${server_url}/kdata/upload`, {
                method: 'POST',
                body: dataDetails
            }).then(res => {
                return res.status;
            }).catch(error => {
                    console.log("This is error");
                    return error;
            });

export const createDir = function (filedetail,currentDir){
  console.log("Inside createDir path:",filedetail);
  return (dispatch) => {
    fetch(`${server_url}/kdata/newDir`, {
          method: 'POST',
          headers: UTIL.getHTTPHeader(),
          body: JSON.stringify(filedetail)
      }).then(res => {
          if(res.status === 201){
            console.log("fav set status:",res.status);
            dispatch(getUserData1(currentDir));
            return res.json();
          }
     }).catch(error => {
          console.log("This is error111");
          return error;
        });
    };
};

export const userlogin = function(userDetail){
  //console.log("userlogin details:",userDetail)
  return (dispatch) => {
    fetch(`${server_url}/kusers/login`, {
          method: 'POST',
          headers: UTIL.getHTTPHeader(),
          body: JSON.stringify(userDetail)
      }).then(res => {
          if(res.status === 201){
            console.log("userlogin status:",res.status);
            //dispatch(getUserData1(currentDir));
            return res.json();
          }else{
            alert((res.message)?res.message:"User Does not exists please sign up  !!!");
            throw "userlogin Failed !!!"
          }
     }).then(result=>{
         console.log("result",result.userinfo.firstname," token :",result.servertoken)
         //saveServerToken(result);
         dispatch(userLoggedIn(result.userinfo));
         UTIL.saveServerToken(result);
         dispatch(getUserData1(''));
    //console.log("result",result.result[0]);
  }).catch(err => {
          console.log("Error while Login!!!");
          return err;
        });
    };
};

export const userSignUp = function(userDetail){
  console.log("userSignUp details:",userDetail)
  return (dispatch) => {
    fetch(`${server_url}/kusers/signup`, {
          method: 'POST',
          headers: UTIL.getHTTPHeader(),
          body: JSON.stringify(userDetail)
      }).then(res => {
          if(res.status === 201){
            console.log("fav set status:",res.status);
            //dispatch(getUserData1(currentDir));
            return res.json();
          }else{
            alert(res.message);
            throw "Sign Up Failed !!!"
          }
     }).then(result=>{
         console.log("result",result.userinfo.firstname," token :",result.servertoken)
         //saveServerToken(result);
         dispatch(userLoggedIn(result.userinfo));
         UTIL.saveServerToken(result);
         dispatch(getUserData1(''));
    //console.log("result",result.result[0]);
  }).catch(err => {
          console.log("Error while setting favourite !!!");
          return err;
        });
    };
};

export const getUserData1 = function(currentDir){
  console.log("userDetail: getUserdata1",currentDir);
  return (dispatch) => {
    fetch(`${server_url}/kusers/getfiledirlist`, {
          method: 'GET',
          headers: UTIL.getHTTPHeader()
      }).then(res => {
          if(res.status === 201){
            console.log("userlogin reply status:",res.status);
            return res.json();
          }
     }).then(result=>{
         console.log("result",result," tokfilesen :",result.files)
         dispatch(updateUserDataInfo(result.files));
         dispatch(updateDisplayData(currentDir));
         dispatch(userDataScreen());
     }).catch(error => {
          console.log("This is error111");
          return error;
        });
    };
}

export const downloadData = (filedetail) =>{
  console.log("Inside downloadData path:",filedetail);
  return (dispatch) => {
    fetch(`${server_url}/data/download`, {
          method: 'POST',
          headers: UTIL.getHTTPHeader(),
          body: JSON.stringify(filedetail)
      })
    .then(res => {
            console.log("downloadData status:");
          return res.blob()
     }).then(function(file) {
            FileSaver.saveAs(file, filedetail.name);
          }

     ).catch(err => {
          console.log("Error while downloadData !!!");
          return err;
        });
    };

};

export const setFav = (filedetail,currentDir) =>{
  console.log("Inside Set star path:",filedetail);
  return (dispatch) => {
    fetch(`${server_url}/kdata/star`, {
          method: 'POST',
          headers: UTIL.getHTTPHeader(),
          body: JSON.stringify(filedetail)
      }).then(res => {
          if(res.status === 201){
            console.log("fav set status:",res.status);
            dispatch(getUserData1(currentDir));
            return res.json();
          }
     }).catch(err => {
          console.log("Error while setting favourite !!!");
          return err;
        });
    };
};

export const shareData = (sharedata,currentDir) =>{
  console.log("Inside shareData path:",sharedata);
  return (dispatch) => {
    fetch(`${server_url}/kdata/sharedata`, {
          method: 'POST',
          headers: UTIL.getHTTPHeader(),
          body: JSON.stringify(sharedata)
      }).then(res => {
          if(res.status === 201){
            console.log("shareData status:",res.status);
            dispatch(getUserData1(currentDir));
            return res.json();
          }
     }).catch(err => {
          console.log("Error while shareData!!!");
          return err;
        });
    };
};

export const onDelete = (file,currentDir) =>{
  console.log("Inside onDelete path:",file,"currentDir:",currentDir);
  return (dispatch) => {
    fetch(`${server_url}/kdata/delete`, {
          method: 'POST',
          headers: UTIL.getHTTPHeader(),
          body: JSON.stringify({data:file})
      }).then(res => {
          if(res.status === 201){
            console.log("onDelete status:",res.status);
            dispatch(getUserData1(currentDir));
            return res.json();
          }
     }).catch(err => {
          console.log("Error while onDelete!!!");
          return err;
        });
    };
};

export const getActivityReport = function(){
  console.log("getActivityReport");
  return (dispatch) => {
    fetch(`${server_url}/kusers/activityreport`, {
          method: 'GET',
          headers: UTIL.getHTTPHeader()
      }).then(res => {
          if(res.status === 201){
            console.log("userlogin reply status:",res.status);
            return res.json();
          }
     }).then(result=>{
         console.log("result",result," activity :",result.report)
         dispatch(setActivityData(result.report));
         dispatch(activityScreen(null));
     }).catch(error => {
          console.log("This is getActivityReport");
          return error;
        });
    };
}

export const getUserPersonalInfo = function(){
  console.log("getActivityReport");
  return (dispatch) => {
    fetch(`${server_url}/kusers/userdata`, {
          method: 'GET',
          headers: UTIL.getHTTPHeader()
      }).then(res => {
          if(res.status === 201){
            console.log("userlogin reply status:",res.status);
            return res.json();
          }
     }).then(result=>{
         console.log("result",result," activity :",result)
         dispatch(updateUserPersonalInfo(result));
         dispatch(displayUserInfo(''));
     }).catch(error => {
          console.log("This is getActivityReport");
          return error;
        });
    };
};

export const createGroup = (grpdata,currentDir) =>{
  console.log("Inside createGroup grpdata:"+grpdata+" currentDir"+currentDir);
  return (dispatch) => {
    fetch(`${server_url}/kdata/creategroup`, {
          method: 'POST',
          headers: UTIL.getHTTPHeader(),
          body: JSON.stringify(grpdata)
      }).then(res => {
          if(res.status === 201){
            console.log("onDelete status:",res.status);
            dispatch(getUserData1(currentDir));
            return res.json();
          }
     }).catch(err => {
          console.log("Error while creating group!!!");
          return err;
        });
    };
};

export const getgrpMembers = (grpdata,currentDir) =>{
  console.log("Inside getgrpMembers grpdata:"+grpdata+" currentDir"+currentDir);
  return (dispatch) => {
    fetch(`${server_url}/kdata/getgrpmembers`, {
          method: 'POST',
          headers: UTIL.getHTTPHeader(),
          body: JSON.stringify({data:grpdata})
      }).then(res => {
          if(res.status === 201){
            console.log("getgrpMembers status:",res.status);

            return res.json();
          }
     }).then(result =>{
        dispatch(updategrpMemInfo(result));
        dispatch(getGrpEditScreen(currentDir));
     }).catch(err => {
          console.log("Error while creating group!!!");
          return err;
        });
    };
};

export const deletegrpMember = (member,currentDir) =>{
  console.log("Inside deletegrpMember:"+member.path+" currentDir"+currentDir);
  return (dispatch) => {
    fetch(`${server_url}/kdata/deletegrpmem`, {
          method: 'POST',
          headers: UTIL.getHTTPHeader(),
          body: JSON.stringify(member)
      }).then(res => {
          if(res.status === 201){
            console.log("deletegrpMember status:",res.status);

            return res.json();
          }
     }).then(result =>{
        dispatch(getgrpMembers({path:member.path}));
     }).catch(err => {
          console.log("Error deletegrpMember!!!");
          return err;
        });
    };
};

export const addgrpMember = (data,currentDir) =>{
  console.log("Inside addgrpMember:"+data.grp+" currentDir"+currentDir);
  return (dispatch) => {
    fetch(`${server_url}/kdata/addgrpmem`, {
          method: 'POST',
          headers: UTIL.getHTTPHeader(),
          body: JSON.stringify(data)
      }).then(res => {
          if(res.status === 201){
            console.log("addgrpMember status:",res.status);

            return res.json();
          }
     }).then(result =>{
        dispatch(getgrpMembers({path:data.grp.path}));
     }).catch(err => {
          console.log("Error addgrpMember!!!");
          return err;
        });
    };
};
