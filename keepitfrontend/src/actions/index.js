
export const userLoggedIn = (userDetail) => {
    console.log("Action userLogged In: ",userDetail);
    return {
        type: 'USER_LOGGED_IN',
        data: userDetail
    }
};

export const userLoggedOut = () => {
    console.log("User clicked on out ");
    return {
        type: 'USER_LOGGED_Out',
        data:null
    }
};
export const userLoginFail = (response)=>{
  return {
    type:'LOGIN_FAILED',
    data:response
  }
};
export const userSignUp = (userDetail) => {
    console.log("You clicked on userSignUp: ",userDetail);
    return {
        type: 'USER_SIGN_UP',
        data: userDetail
    }
};
export const updateUserDataInfo = (userdata) => {
    console.log("You clicked on updateUserDataInfo: ",userdata);
    return {
        type: 'UPDATE_USER_DATA_INFO',
        data: userdata
    }
};
export const displayUserInfo = (user) =>{
  return{
    type:'USER_PERSONAL_INFO',
    data:user
  }
};
export const updategrpMemInfo = (user) =>{
  return{
    type:'UPDATE_GRP_MEM',
    data:user
  }
};
export const updateUserPersonalInfo = (userinfo) =>{
  return{
    type:'UPDATE_USER_PERSONAL_INFO',
    data:userinfo
  }
};
export const updateDisplayData = (currentDir) => {
  return {
    type:'UPDATE_DISPLAY_DATA_INFO',
    currentdir:currentDir
  }
};

export const getFilesDir = (filesDirs = '/') => {
    console.log("You clicked on show files: ");
    return {
        type: 'GET_FILES_DIR',
        data: filesDirs
    }
};

export const userDetails = (user) => {
    console.log("You clicked on userDetails: ");
    return {
        type: 'USER_DETAILS',
        data: user
    }
};

export const fileSelected = (file) => {
    console.log("You clicked on FILE_SELECTED: ");
    return {
        type: 'FILE_SELECTED',
        payload: file
    }
};

export const uploadScreen = (user) => {
    console.log("You clicked on UPLOAD_FILES: ");
    return {
        type: 'DISPLAY_UPLOAD_SCREEN',
        data: user
    }
};
export const sharingScreen = (sharedata) => {
    console.log("You clicked on SHARING_SCREEN: ");
    return {
        type: 'SHARING_SCREEN',
        data: sharedata
    }
};
export const createDirScreen = (user) => {
    console.log("You clicked on DISPLAY_CREATEDIR_SCREEN: ");
    return {
        type: 'DISPLAY_CREATEDIR_SCREEN',
        data: user
    }
};
export const createGrpScreen = (grpinfo) => {
    console.log("You clicked on DISPLAY_CREATEGRP_SCREEN: ");
    return {
        type: 'DISPLAY_CREATEGRP_SCREEN',
        data: grpinfo
    }
};
export const activityScreen = () => {
    console.log("You clicked on ACTIVITY_SCREEN: ");
    return {
        type: 'ACTIVITY_SCREEN',
        data: null
    }
};
export const setActivityData = (activitydata) => {
    console.log("You clicked on setActivityData: ");
    return {
        type: 'SET_ACTIVITY_DATA',
        data: activitydata
    }
};


export const uploadDone = () => {
    console.log("You clicked on UPLOAD_DONE: ");
    return {
        type: 'UPLOAD_DONE',
        data: null
    }
};
export const userDataScreen = () => {
    console.log("You clicked on DISPLAY_USER_DATA_SCREEN: ");
    return {
        type: 'DISPLAY_USER_DATA_SCREEN',
        data:null
    }
};

export const getGrpEditScreen = (currentDir) => {
    console.log("You clicked on DISPLAY_GRP_EDIT_SCREEN: ");
    return {
        type: 'DISPLAY_GRP_EDIT_SCREEN',
        data:currentDir
    }
};
export const uploadFile = (user) => {
    console.log("You clicked on UPLOAD_FILES: ");
    return {
        type: 'UPLOAD_FILES',
        data: user
    }
};

export const createDirectory = (dir) => {
    console.log("You clicked on CREATE_DIRECTORY: ");
    return {
        type: 'CREATE_DIRECTORY',
        data: dir
    }
};
export const share = (item) => {
    console.log("You clicked on UPLOAD_FILES: ");
    return {
        type: 'SHARE',
        data: item
    }
};

export const requestData = (user) => {
    console.log("You clicked on requestData: ");
    return {
        type: 'REQUEST_DATA',
        data: user
    }
};

export const receiveData = (user) => {
    console.log("You clicked on receiveData: ");
    return {
        type: 'RECEIVE_DATA',
        data: user
    }
};
