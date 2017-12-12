import React,{ Component } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import TextField from 'material-ui/TextField';
import {userSignUp} from './../actions/index'
//import {uploadFile} from './../api/Api';
import {createDir,shareData} from './../api/Api';
class SharingScreen extends Component {

    constructor(){
        super();
        this.data={};
    }
    setDesPath(path){
      this.folderpath['path'] = this.props.currentDir + "/" + path;
    }
  render() {
    this.data.shareData = this.props.sharingData;
    return (
      <div className="container-fluid">
        <label style={{fontSize:20,color:"#0080ff"}}>{this.props.sharingData.name}</label>
        <hr/>
        <span className= "glyphicon glyphicon-user col-sm-2 col-md-2 col-lg-2"
        style={{fontSize:15,color:"#0080ff"}}>To :</span>
        <input type="text"  className="TextField col-sm-7 col-md-7 col-lg-7" id="directoryname"
        placeholder="email or name" style={{fontSize:20,text:"center"}}
        onChange={(userinput) => {this.data.users = userinput.target.value}}/>
        <button type="button" className="btn btn-primary col-sm-2 col-md-2 col-lg-2 pull-right"
        onClick={() => this.props.shareData(this.data,this.props.currentDir)}>Submit</button>
      </div>


    );
  }
}
function mapStateToProps(state) {
    console.log("mapStateToProps create directory",state);
      return {
          currentUser : state.UserReducer.currentUser,
          currentDir:state.FileReducer.currentDir,
          sharingData:state.UserReducer.sharingData
      };
  }
function matchDispatchToProps(dispatch){
    return bindActionCreators({createDir:createDir,
    shareData:shareData}, dispatch);
}
export default connect(mapStateToProps,matchDispatchToProps)(SharingScreen);
