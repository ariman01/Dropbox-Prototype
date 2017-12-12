import React, { Component } from 'react';
import './App.css';
import UserSignIn from './components/usersignin';
import UserSignUp from './components/usersignup';
import UserHome from './components/userhome';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
class App extends Component {
  render() {
    console.log("App Render -1 ",this.props.currentUser )
    console.log(this.props.currentUser ? "hey true":"heyfalse");
    return (
      <BrowserRouter>

        <Switch>
            <Route  exact path="/signup" render ={() => (
                      (this.props.currentUser )? (<UserHome/>) : (<UserSignUp/>))}/>
            <Route  exact path="/" render ={() => (
              this.props.currentUser ? <UserHome/>:<UserSignIn/>)
                        }/>

        </Switch>
      </BrowserRouter>
    );
  }
}
function mapStateToProps(state) {
  console.log("Arijit mapStateToProps App",state);
  console.log("Arijit mapStateToProps App-1 :",state.UserReducer.currentUser);
    return {
        currentUser: state.UserReducer.currentUser
    };
}

export default connect(mapStateToProps)(App);
