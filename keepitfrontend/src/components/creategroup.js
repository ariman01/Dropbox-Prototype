import React,{ Component } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import TextField from 'material-ui/TextField';
import {userSignUp} from './../actions/index';
import {createGroup} from './../api/Api';
class CreateGroup extends Component {

    constructor(){
        super();
        this.data={};
    }
    setDesPath(path){
      this.data['path'] = this.props.currentDir + "/" + path;
    }
  render() {
    return (
      <div className="container-fluid">
        <div className="container-fluid">
        <span className="glyphicon glyphicon-folder-close col-sm-2 col-md-2 col-lg-2 pull-left" style={{color:"#0080ff",fontSize: 30}}></span>
        <input type="text"  className="TextField col-sm-7 col-md-7 col-lg-7" id="groupname"
        placeholder="Name your Group" style={{fontSize:18,text:"center"}}
        onChange={(userinput) => {this.setDesPath(userinput.target.value)}}/>

        </div>
        <hr/>
        <div className="container-fluid">
        <span className= "glyphicon glyphicon-user col-sm-2 col-md-2 col-lg-2"
        style={{fontSize:15,color:"#0080ff"}}>To :</span>
        <input type="text"  className="TextField col-sm-7 col-md-7 col-lg-7" id="directoryname"
        placeholder="email list of group member" style={{fontSize:18,text:"center"}}
        onChange={(userinput) => {this.data['userlist'] = userinput.target.value}}/>
        </div>
        <div className="container-fluid" style={{marginTop:"6%"}}>
        <button type="button" className="btn btn-primary  col-lg-offset-6 col-lg-3"
        onClick={() => this.props.createGroup(this.data,this.props.currentDir)}>Submit</button>
        </div>
      </div>


    );
  }
};

function mapStateToProps(state) {
      return {
          currentUser : state.UserReducer.currentUser,
          currentDir:state.FileReducer.currentDir
      };
  }
function matchDispatchToProps(dispatch){
    return bindActionCreators({createGroup:createGroup}, dispatch);
}
export default connect(mapStateToProps,matchDispatchToProps)(CreateGroup);
