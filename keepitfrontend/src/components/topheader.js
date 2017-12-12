import React,{ Component } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
//import {Link} from "react-router-dom";
import {userLoggedOut} from './../actions/index';
import Icon from '../db.png';


class TopHeader extends Component {

  getNavBarRightEnd(){
    if(!this.props.currentUser){
      return(
        <ul className="nav navbar-nav navbar-right">
          <li><a href="/signup" style={{color:"#2895F1"}}>
          <span className="glyphicon glyphicon-user" ></span> Sign Up</a></li>
        </ul>
      );
    }else{
      return(
        <ul className="nav navbar-nav navbar-right">
          <li><a  style={{color:"#1492E9"}}>
          <span className="glyphicon glyphicon-user" ></span> Welcome </a></li>
          <li>
          <button type="button" className="btn btn-default"
          style={{border:"none", color:"#2895F1", backgroundColor:"white",marginTop:7}}
          onClick={() => this.props.userLogout()}>
          <span className="glyphicon glyphicon-log-out pull-right">Logout</span>
          </button>
          </li>

        </ul>
      );
    }

  }
  render() {
    return (
      <div>
      <nav className="navbar navbar-default navbar-fixed-top "
       style={{backgroundColor:"#FFFFFF",borderColor:"#A0A0A0",shadow:5, height:80}}>

        <div className="container-fluid">
          <div className="navbar-header" >
        <a className="navbar-brand" style={{marginLeft:523}} href="/" > <img src={Icon} /> </a>
          </div>

          {this.getNavBarRightEnd()}
        </div>
      </nav>
      </div>
    );
  }
}

function mapStateToProps(state) {
    return {
        currentUser: state.UserReducer.currentUser
    };
}

function matchDispatchToProps(dispatch){
    console.log("Arijit dispatch header");
    return bindActionCreators({userLogout: userLoggedOut}, dispatch);
}

export default connect(mapStateToProps,matchDispatchToProps)(TopHeader);
