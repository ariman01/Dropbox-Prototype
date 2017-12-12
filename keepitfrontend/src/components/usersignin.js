import React,{ Component } from 'react';
import TopHeader from './topheader';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {userlogin} from './../api/Api';

class UserSignIn extends Component {

  constructor(){
      super();
      this.userinfo={
        username:'',
        password:''
      }
  }

  render() {
    console.log(" User Sign In render");
    return (
    <div className="container-fluid">
    <div>  <TopHeader/></div>
    <div className="container-fluid " style={{marginTop:"10%"}} >

    <form className="col-sm-offset-4 col-md-offset-4 col-lg-offset-4 col-sm-4 col-md-4 col-lg-4">
    <div className="form-group text-center">
      <label style={{fontSize:20,color:"#383838"}}>Sign In</label>
    </div>
      <div className="form-group">
        <label style={{fontSize:15,color:"#383838"}}>Username</label>
        <input type="text" className="form-control text-center" id="username" placeholder="Email Id "
        onChange={(userinput) => {

            this.userinfo.username=userinput.target.value}}/>
      </div>
      <div className="form-group">
        <label style={{fontSize:15,color:"#383838"}}>Password</label>
        <input type="password" className="form-control text-center" id="password" placeholder="Password"
        onChange={(userpassword) => {
            this.userinfo.password=userpassword.target.value}}/>
      </div>
      <div >
      <button className="btn btn-primary col-lg-3" type="button"
      onClick={() => this.props.userLogin(this.userinfo)}>Sign In</button>
      </div>
    </form>

    </div>
    </div>
    );
  }
}

function matchDispatchToProps(dispatch){
    console.log("Arijit dispatch",dispatch);
    return bindActionCreators({userLogin: userlogin}, dispatch);
}
export default connect(null, matchDispatchToProps)(UserSignIn);
