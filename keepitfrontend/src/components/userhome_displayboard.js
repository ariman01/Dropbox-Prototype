import React,{ Component } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import UserPersonalInfoElement from './personalinfo_ui_element';
import UserDataElement from './userdata_element';
import UploadScreen from './uploadscreen';
import CreateDirScreen from './create_directory';
import SharingScreen from './sharingScreen';
import ActivityScreen from './useractivityScreen';
import CreateGroup from './creategroup';
import GroupEditScreen from './groupeditscreen';

class UserHomeDisplayBoard extends Component {

  renderDisplay(){
    console.log("this.props.shldDisplayGrpEdit",this.props.shldDisplayGrpEdit);
    if(this.props.displayUserData){

    }else if(this.props.shldDisplayUserRecentActivity){
      return this.getActivityScreen();
    }else if(this.props.shldDisplayUploadScreen){
      return this.getUploadScreen();
    }else if(this.props.shldDisplaycreateDir){
      return this.getcreateDirScreen();
    }else if(this.props.shldDisplaySharingScreen){
      return this.getSharingScreen();
    }else if(this.props.shldDisplayUserAccount){
      return this.getUserPersonalInfoView();
    }else if(this.props.shldDisplayCreateGrp){
      return this.getcreateGrpScreen();
    }else if(this.props.shldDisplayGrpEdit){
      return this.getGrpEditScreen();
    }else{
      console.log("typeof :",typeof this.data);
      return this.getUserDataView(this.props.displaydata);
    }
  }

  getUploadScreen(){
    return (<UploadScreen/>)
  }
  getGrpEditScreen(){
    return (<GroupEditScreen/>);
  }
  getcreateGrpScreen(){
    console.log("getcreateGrpScreen !!!");
    return(<CreateGroup/>)
  }
  getActivityScreen(){
    console.log("getActivityScreen !!!");
    return(<ActivityScreen/>)
  }
  getSharingScreen(){
    return(<SharingScreen/>)
  }
  getcreateDirScreen(){
    return(<CreateDirScreen/>)
  }
  getUserDataView(data){
    console.log("getUserDataView data",data)
    if(data.length > 0 ){
    return data.map((eachdata) => {
        return(
          <div>
          <UserDataElement key={eachdata.name} data={eachdata}/>
          
          </div>
        );
    })
  }else{
    return(<div><h3> No Files Uploaded </h3><hr/></div>)
  }
  }
  getUserPersonalInfoView(){
    let userinfo = this.props.userPersonalInfo;
    console.log(Object.keys(userinfo));
    return Object.keys(userinfo).map((item) => {
        return(
          <UserPersonalInfoElement key={item} infolabel={item} info={userinfo[item]}/>
        );
    })
  }
  getUserRecentActivityView(){

  }

  render() {
    console.log("UserHomeDisplayBoard render");
    return (
    <div>
      <ul className="list-group">
      <div>
        {this.renderDisplay()}
        </div>
      </ul>
      </div>
    );
  }
}

function mapStateToProps(state) {
    console.log("mapStateToProps UserHomeDisplayBoard",state);
      return {
          shldDisplayUserAccount: state.UserReducer.displayUserInfo,
          shldDisplayUserData:state.UserReducer.displayUserData,
          shldDisplayUserRecentActivity:state.UserReducer.displayUserActivityReport,
          shldDisplayUploadScreen:state.UserReducer.displayUploadScreen,
          shldDisplaycreateDir:state.UserReducer.displayCreateDir,
          shldDisplayCreateGrp:state.UserReducer.displayCreateGrp,
          shldDisplayGrpEdit:state.UserReducer.displayGrpEdit,
          shldDisplaySharingScreen:state.UserReducer.displaySharingScreen,
          currentUser : state.UserReducer.currentUser,
          currentDir:state.FileReducer.currentDir,
          displaydata:state.FileReducer.displaydata,
          userPersonalInfo:state.UserReducer.userPersonalInfo

      };
  }
export default connect(mapStateToProps)(UserHomeDisplayBoard);
