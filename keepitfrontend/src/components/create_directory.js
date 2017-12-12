import React,{ Component } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import TextField from 'material-ui/TextField';
import {userSignUp} from './../actions/index';
import {createDir} from './../api/Api';
class CreateDirScreen extends Component {

    constructor(){
        super();
        this.folderpath={};
    }
    setDesPath(path){
      this.folderpath['path'] = this.props.currentDir + "/" + path;
    }
  render() {
    return (
      <div className="container-fluid">
        <span className="glyphicon glyphicon-folder-close col-sm-1 col-md-1 col-lg-1 pull-left" style={{color:"#0080ff",fontSize: 30}}></span>
        <input type="text"  className="TextField col-sm-7 col-md-7 col-lg-7" id="directoryname"
        placeholder="Name your directory" style={{fontSize:20,text:"center"}}
        onChange={(userinput) => {this.setDesPath(userinput.target.value)}}/>
        <button type="button" className="btn btn-primary col-sm-3 col-md-3 col-lg-3 pull-right"
        onClick={() => this.props.createDir(this.folderpath,this.props.currentDir)}>Submit</button>
      </div>


    );
  }
}
function mapStateToProps(state) {
    console.log("mapStateToProps create directory",state);
      return {
          currentUser : state.UserReducer.currentUser,
          currentDir:state.FileReducer.currentDir
      };
  }
function matchDispatchToProps(dispatch){
    return bindActionCreators({createDir:createDir}, dispatch);
}
export default connect(mapStateToProps,matchDispatchToProps)(CreateDirScreen);
