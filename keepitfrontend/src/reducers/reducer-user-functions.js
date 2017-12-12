import * as UTIL from './../util/utils';
const initialState = {
        currentUser : null,
        userPersonalInfo:{},
        displayUserInfo:false,
        displayUserData:false,
        displayUserActivityReport:false,
        displayUploadScreen:false,
        displayCreateDir:false,
        displaySharingScreen:false,
        displayCreateGrp:false,
        displayGrpEdit:false
};
export default function (state = initialState, action) {
    switch (action.type) {
        case 'USER_LOGIN':
          /*let user = userValidation(action.payload);
          return Object.assign({}, state, {
          currentUser: user,
          displayUserInfo:true
        })*/

        case 'USER_DETAILS':
          console.log("action handler USER_DETAILS");
          return Object.assign({}, state, {
          })

        case 'DISPLAY_UPLOAD_SCREEN':
          console.log("User DISPLAY_UPLOAD_SCREEN");
          return Object.assign({}, state, {
            displayUserInfo:false,
            displayUserData:false,
            displayUserActivityReport:false,
            displaySharingScreen:false,
            displayCreateGrp:false,
            displayGrpEdit:false,
            displayUploadScreen:true
          })
          case 'DISPLAY_CREATEDIR_SCREEN':
            console.log("User DISPLAY_CREATEDIR_SCREEN");
            return Object.assign({}, state, {
              displayUserInfo:false,
              displayUserData:false,
              displayUserActivityReport:false,
              displayUploadScreen:false,
              displaySharingScreen:false,
              displayCreateGrp:false,
              displayGrpEdit:false,
              displayCreateDir:true

            })

          case 'DISPLAY_CREATEGRP_SCREEN':
          console.log("User DISPLAY_CREATEDIR_SCREEN");
          return Object.assign({}, state, {
            displayUserInfo:false,
            displayUserData:false,
            displayUserActivityReport:false,
            displayUploadScreen:false,
            displaySharingScreen:false,
            displayCreateDir:false,
            displayGrpEdit:false,
            displayCreateGrp:true

          })
          case 'DISPLAY_GRP_EDIT_SCREEN':
          console.log("User DISPLAY_GRP_EDIT_SCREEN");
          return Object.assign({}, state, {
            displayUserInfo:false,
            displayUserData:false,
            displayUserActivityReport:false,
            displayUploadScreen:false,
            displayCreateDir:false,
            displaySharingScreen:false,
            displayCreateGrp:false,
            displayGrpEdit:true

          })

          case 'UPDATE_USER_PERSONAL_INFO':
            console.log("User DISPLAY_CREATEDIR_SCREEN");
            return Object.assign({}, state, {
              userPersonalInfo:action.data
            })

          case 'DISPLAY_USER_DATA_SCREEN':
            console.log("User DISPLAY_UPLOAD_SCREEN");
            return Object.assign({}, state, {
              displayUserInfo:false,
              displayUserData:true,
              displayUserActivityReport:false,
              displayUploadScreen:false,
              displaySharingScreen:false,
              displayCreateGrp:false,
              displayGrpEdit:false,
              displayCreateDir:false
            })

            case 'SHARING_SCREEN':
              console.log("User SHARING_SCREEN");
              return Object.assign({}, state, {
                displayUserInfo:false,
                displayUserData:false,
                displayUserActivityReport:false,
                displayUploadScreen:false,
                displayCreateDir:false,
                displaySharingScreen:true,
                displayCreateGrp:false,
                displayGrpEdit:false,
                sharingData:action.data
              })
            case 'ACTIVITY_SCREEN':
                console.log("User ACTIVITY_SCREEN");
                return Object.assign({}, state, {
                  displayUserInfo:false,
                  displayUserData:false,
                  displayUserActivityReport:true,
                  displayUploadScreen:false,
                  displayCreateDir:false,
                  displayCreateGrp:false,
                  displayGrpEdit:false,
                  displaySharingScreen:false
                })
            case 'USER_LOGGED_IN':
              console.log("User Logged  IN");
              return Object.assign({}, state, {
              currentUser: action.data,
              displayUserInfo:true
            })

        case 'USER_LOGGED_Out':
        console.log("User logout");
        UTIL.deleteServerToken();
        return Object.assign({}, state, {
        currentUser: null
      })
        case 'UPLOAD_DONE':
          console.log("Action handler UPLOAD_DONE");
          return Object.assign({}, state, {
          displayUploadScreen: false,
          displayUserData:true
        })

      case 'USER_PERSONAL_INFO':
        console.log("User Personal Info");
        return Object.assign({}, state, {
          displayUserInfo:true,
          displayUserData:false,
          displayUserActivityReport:false,
          displayUploadScreen:false,
          displayCreateDir:false,
          displayCreateGrp:false,
          displayGrpEdit:false,
          displaySharingScreen:false
        })

      case 'LOGIN_FAILED':
        alert("Login Failed username and password does not match.");
    default:
    return state;
  }
}
