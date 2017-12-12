import React,{ Component } from 'react';
import TopHeader from './topheader';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {uploadScreen,createDirScreen,createGrpScreen} from './../actions/index';
import {getUserData1,getActivityReport,getUserPersonalInfo} from './../api/Api';
import UserHomeDisplayBoard from './userhome_displayboard';
class UserHome extends Component {


  render() {
    console.log(this.props.files);
    return (
    <div>
    <div className="container-fluid">  <TopHeader/></div>
    <div className="container-fluid text-center" style={{marginTop:"8%"}}>
    <div className="row content">

    <div className="col-sm-2 col-lg-2 col-md-2 sidenav" style={{marginTop:"4%"}}>
      <p ><a  onClick={() => this.props.getUserPersonalInfo()}>User Account</a></p>
      <hr/>
      <p><a onClick={() => this.props.getFilesDir('')}>Files</a></p>
      <hr/>
      <p><a onClick={() => this.props.getActivityReport()}>Recent Activity</a></p>
      <hr/>
    </div>

    <div className="col-sm-7 col-lg-7 text-left">
      <UserHomeDisplayBoard/>
    </div>

    <div className="col-sm-3 col-lg-3 col-md-3 sidenav" style={{marginTop:"2%"}}>
    <button type="button" className="btn btn-primary btn-block"
    onClick={() => this.props.uploadScreen(null)}>Upload Files</button>
    <button type="button" className="btn btn-default btn-block"
    onClick={() => this.props.createDirScreen(null)}>New Folder</button>
    <button type="button" className="btn btn-default btn-block"
    onClick={() => this.props.createGrpScreen(null)}>Create Group</button>
    </div>
   </div>
    </div>
    </div>
    );
  }
}

  function mapStateToProps(state) {
    console.log("Arijit",state);
      return {
          files: state,
          currentDir:state.FileReducer.currentDir
      };
  }

  function matchDispatchToProps(dispatch){
      return bindActionCreators({getFilesDir: getUserData1,
        uploadScreen:uploadScreen,
        createDirScreen:createDirScreen,
        createGrpScreen:createGrpScreen,
        getActivityReport:getActivityReport,
        getUserPersonalInfo:getUserPersonalInfo
      }, dispatch);
  }

export default connect(mapStateToProps, matchDispatchToProps)(UserHome);
