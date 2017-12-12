import * as UTIL from './../util/utils';

const initialState = {
        currentDir : '',
        userdata:null,
        displaydata:[],
        activitydata:[],
        currentGrp:null,
        groupmembers:[]
};


export default function (state = initialState, action) {
    switch (action.type) {

        case 'UPDATE_USER_DATA_INFO':
          return Object.assign({}, state, {
            userdata:action.data
          })

        case 'UPDATE_DISPLAY_DATA_INFO':
          console.log("UPDATE_DISPLAY_DATA_INFO ",action.currentdir);
          
          let currentdir_data = UTIL.getdisplayData(action.currentdir,state.userdata);
          console.log("currentdir_data: 11111111111",currentdir_data);
          return Object.assign({},state,{
            currentDir:action.currentdir,
            displaydata:currentdir_data
          })


        case 'UPDATE_GRP_MEM':
          console.log("User UPDATE_GRP_MEM");
          return Object.assign({}, state, {
            groupmembers:action.data.members,
            currentGrp:action.data.grp

          })
        case 'SET_ACTIVITY_DATA':
          return Object.assign({},state,{
            activitydata:action.data
          })
    }
    return state;
}
