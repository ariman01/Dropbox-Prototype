import React, { Component } from 'react';

class UserPersonalInfoElement extends Component{

  render(){

    return (<div>
      <li className="list-group-item list-group-item-warning">
      {this.props.infolabel.toUpperCase()+" : "+this.props.info}
      </li>
    </div>);
  }
}

export default UserPersonalInfoElement;
