import React,{ Component } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {createDir} from './../api/Api';

class ActivityScreen extends Component {

  getActivityElement(){
    return this.props.activitydata.map((file) => {
      console.log(file.path);
      return(
        <tr>
          <td>{file.activity}</td>
          <td>{file.date}</td>
          <td>{file.filename}</td>
        </tr>
      );
    });
  }

  render() {
    return(<div class="container-fluid">
    <h2>User Activity</h2>
    <table className="table">
    <thead>
      <tr>
        <th>Activity</th>
        <th>Last Modified Date</th>
        <th>File / Directory</th>
      </tr>
    </thead>
    <tbody>
      {this.getActivityElement()}
    </tbody>
    </table>
    </div>);

}
}
function mapStateToProps(state) {
    console.log("mapStateToProps activity screen",state);
      return {
          activitydata:state.FileReducer.activitydata
      };
}

export default connect(mapStateToProps)(ActivityScreen);
