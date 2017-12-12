import React,{ Component } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import TextField from 'material-ui/TextField';
import {userSignUp} from './../actions/index';
import {deletegrpMember,addgrpMember} from './../api/Api';
class GroupEditScreen extends Component {

    constructor(){
        super();
        this.data={};
    }

    getmembersUI(){
      return this.props.groupmembers.map((member)=>{
        return(
          <div className="form-group">
            <label style={{fontSize:15}}>{member.email}</label>
            <button type="button" className="btn btn-default btn-md col-sm-1 col-md-1 btn-lg col-lg-1 pull-right"
             style={{border:"none",color:"#0080ff", backgroundColor:"white"}}
             onClick={() => this.props.deletegrpMember(member,this.currentDir)}>
             <span className="glyphicon glyphicon glyphicon-remove pull-right" ></span>
             </button>
          </div>
        );
      });
    }
  render() {

    return (
      <div className="container-fluid">
        <hr/>
        <div className="container-fluid">
        <input type="text"  className="TextField col-sm-8 col-md-8 col-lg-8" id="memberlist"
        placeholder="Add Members using email" style={{fontSize:20,text:"center"}}
        onChange={(userinput) => {this.data.users = userinput.target.value}}/>
        <button type="button" className="btn btn-primary  col-lg-offset-1 col-lg-3"
        onClick={() => this.props.addgrpMember({users:this.data.users,grp:this.props.currentGrp},this.currentDir)}>Submit</button>
        </div>
        <hr/>
        <label style={{fontSize:15,color:"#0080ff"}}>Group Members</label>
        {this.getmembersUI()}
      </div>


    );
  }
};

function mapStateToProps(state) {
      return {
          currentUser : state.UserReducer.currentUser,
          currentDir:state.FileReducer.currentDir,
          groupmembers:state.FileReducer.groupmembers,
          currentGrp:state.FileReducer.currentGrp
      };
  }
function matchDispatchToProps(dispatch){
    return bindActionCreators({deletegrpMember:deletegrpMember,
    addgrpMember:addgrpMember}, dispatch);
}
export default connect(mapStateToProps,matchDispatchToProps)(GroupEditScreen);
