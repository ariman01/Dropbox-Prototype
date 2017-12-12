import React,{ Component } from 'react';
import TopHeader from './topheader';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {userSignUp} from './../api/Api';

class UserSignUp extends Component {
  constructor(){
    super();
    this.userinfo ={};
  }
  render() {
    return (
      <div className="container-fluid">
      <div>  <TopHeader/></div>
      <div className="container-fluid" style={{marginTop:"10%"}} >

      <form className="col-sm-offset-4 col-md-offset-4 col-lg-offset-4 col-sm-4 col-md-4 col-lg-4">
      <div className="form-group text-center">
        <label style={{fontSize:20,color:""}}> Sign Up </label>
      </div>
        <div className="form-group">
          <label style={{fontSize:15,color:"#383838"}}>First Name</label>
          <input type="text" className="form-control text-center" id="firstname" placeholder="First Name "
          onChange={(userinput) => {
              //console.log(userinput.target.value);
              this.userinfo.firstname=userinput.target.value}}/>
        </div>
        <div className="form-group">
          <label style={{fontSize:15,color:"#383838"}}>Last Name</label>
          <input type="text" className="form-control text-center" id="lastname" placeholder="Last Name "
          onChange={(userinput) => {
              //console.log(userinput.target.value);
              this.userinfo.lastname=userinput.target.value}}/>
        </div>
        <div className="form-group">
          <label style={{fontSize:15,color:"#383838"}}>Email/ Username</label>
          <input type="text" className="form-control text-center" id="emailid" placeholder="Email Id "
          onChange={(userinput) => {
              //console.log(userinput.target.value);
              this.userinfo.username=userinput.target.value}}/>
        </div>
        <div className="form-group">
          <label style={{fontSize:15,color:"#383838"}}>Password</label>
          <input type="password" className="form-control text-center" id="password" placeholder="Password"
          onChange={(userinput) => {
              //console.log(userinput.target.value);
              this.userinfo.password=userinput.target.value}}/>
        </div>
        <div className="form-group">
          <label style={{fontSize:15,color:"#383838"}}>Contact Info:</label>
          <input type="text" className="form-control text-center" id="contactinfo" placeholder="Phone No "
          onChange={(userinput) => {
              //console.log(userinput.target.value);
              this.userinfo.contactinfo=userinput.target.value}}/>
        </div>
        <div className="form-group">
          <label style={{fontSize:15,color:"#383838"}}>Education / Work</label>
          <input type="text" className="form-control text-center" id="education" placeholder="Education or Work info "
          onChange={(userinput) => {
              //console.log(userinput.target.value);
              this.userinfo.education=userinput.target.value}}/>
        </div>
        <div className="form-group">
          <label style={{fontSize:15,color:"#383838"}}>Interest</label>
          <input type="text" className="form-control text-center" id="interest" placeholder="Interest "
          onChange={(userinput) => {
              //console.log(userinput.target.value);
              this.userinfo.interest=userinput.target.value}}/>
        </div>
        <div >
        <button className="btn btn-primary col-lg-4 col-md-offset-4 " type="button"
        onClick={() => this.props.signup(this.userinfo)}>Sign Up</button>
        </div>
      </form>

      </div>
      </div>


    );
  }
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({signup: userSignUp}, dispatch);
}
export default connect(null,matchDispatchToProps)(UserSignUp);
