import React,{ Component } from 'react';
import TopHeader from './topheader';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import TextField from 'material-ui/TextField';
import {userSignUp} from './../actions/index';
import {uploadData,getUserData1} from './../api/Api';
import {updateDisplayData,uploadDone} from './../actions/index';
class UploadScreen extends Component {
  constructor(){
    super();
    this.uploadFile = null;
  }
  getfiledetail = (event) =>{
    console.log("event",event.target.files[0]);
    this.uploadFile = event.target.files[0];
  }
  uploadData = () => {
    console.log("inside handle file uploaded");
      if(!this.uploadFile){
        alert("Please choose file to upload !!!");

      }else{
        const dataDetails = new FormData();
        dataDetails.append('userfile', this.uploadFile);
        dataDetails.append('currentdir',this.props.currentDir);
        dataDetails.append('username',this.props.currentUser.username);
        console.log("this.props.currentUser.username",this.props.currentUser.username,this.props.currentDir);
            uploadData(dataDetails)
            .then((status) => {
                if (status === 201) {
                    console.log("uploaded",this.props.currentDir);
                    //this.props.uploadDone();
                    this.props.getUserData1(this.props.currentDir);
                }
            });
      }

  };

  render() {
    return (
      <div >
      <input type="file" name="userfile"
      onChange={this.getfiledetail}/>
      <button type="button" className="btn btn-primary" style = {{marginTop:5}}
       onClick={this.uploadData}>Submit
       </button>
      </div>


    );
  }
}
function mapStateToProps(state) {
    console.log("mapStateToProps uploadScreen",state);
      return {
          currentUser : state.UserReducer.currentUser,
          currentDir:state.FileReducer.currentDir
      };
  }
function matchDispatchToProps(dispatch){
    return bindActionCreators({updateDisplayData:updateDisplayData,
    uploadDone:uploadDone,
    getUserData1:getUserData1}, dispatch);
}
export default connect(mapStateToProps,matchDispatchToProps)(UploadScreen);
