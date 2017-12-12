import React, { Component } from 'react';
import {connect} from 'react-redux';
import {updateDisplayData,sharingScreen} from './../actions/index';
import {bindActionCreators} from 'redux';
import {setFav, downloadData,onDelete,getgrpMembers} from './../api/Api';
var path = require('path');

class UserDataElement extends Component{

  getFavIcon(favStatus){
    console.log("getFavIcon :",favStatus);
    if(favStatus){
      return (<span className="glyphicon glyphicon-star pull-right"></span>);
    }else{
      return (<span className="glyphicon glyphicon-star-empty pull-right"></span>);
    }
  }

  getDeleteIcon(data){
    if(data.owner){
      return(<button type="button" className="btn btn-default btn-md col-md-1 btn-lg col-lg-1 pull-right"
       style={{border:"none",color:"#2895F1", backgroundColor:"white"}}
       onClick={() => this.props.ondelete(data,this.props.currentDir)}>
       <span className="glyphicon glyphicon glyphicon-remove pull-right"></span>
       </button>)
    }
  }
  getEditIcon(data){
    if(data.owner){
      return(<button type="button" className="btn btn-default  col-sm-2 btn-md col-md-2 btn-lg col-lg-2 " style={{border:"none"}}
      onClick={() => this.props.getgrpMembers(data,this.props.currentDir)}>
      <span className="glyphicon glyphicon"></span> Edit
      </button>)
    }
  }
  setFav(data){

    this.props.setFav({path:data.path,
                       star:!data.fav},this.props.currentDir);
  }
  getElement(data){
    if(data.isGrp){
      return (
        <li className="list-group-item list-group-item" style={{border:"none"}}>
        <div className="container-fluid">
        <button type="button" className="btn btn-default btn-lg col-lg-8 col-sm-8 btn-md col-md-8" style={{border:"none"}}
        onClick={() => this.props.updateDisplayData(this.props.currentDir+data.name+"/")}>
        <span className="glyphicon glyphicon-user pull-left" style={{color:""}}>
        <span className="glyphicon glyphicon-user" style={{color:""}}>
        </span>
        </span>

        {data.name}</button>
        {this.getEditIcon(data)}
        <button type="button" className="btn btn-default col-sm-1 btn-md col-md-1 btn-lg col-lg-1 "
         style={{border:"none",color:"#2895F1", backgroundColor:"white"}}
         onClick={() => this.setFav(data)}>
        {this.getFavIcon(data.fav)}

        </button>
        {this.getDeleteIcon(data)}
        </div>
        </li>
      );

    }else if(data.isFile){
      return(

        <li className="list-group-item list-group-item" style={{border:"none"}}>
        <div className="container-fluid">
        <button type="button" className="btn btn-default  btn-md col-md-8 btn-lg col-sm-8 col-lg-8  " style={{border:"none"}}
        onClick={() => this.props.downloadData({path:data.path,name:data.name})}>
        <span className="glyphicon glyphicon-file pull-left" style={{color:""}}>
        </span>
        {data.name}</button>
        <button type="button" className="btn btn-default   btn-md col-sm-2 col-md-2 col-sm-2 btn-lg col-lg-2 " style={{border:"none"}}
        onClick={() => this.props.sharingScreen(data)}>
        <span className="glyphicon glyphicon"></span> Share
        </button>
        <button type="button" className="btn btn-default btn-md col-md-1 btn-lg col-lg-1"
         style={{border:"none",color:"#2895F1", backgroundColor:"white"}}
         onClick={() => this.setFav(data)}>
        {this.getFavIcon(data.fav)}
        </button>
        {this.getDeleteIcon(data)}
        </div>
        </li>
      );

    }else{
        return (
          <li className="list-group-item list-group-item" style={{border:"none"}}>
          <div className="container-fluid">
          <button type="button" className="btn btn-default btn-lg col-lg-8 col-sm-8 btn-md col-md-8" style={{border:"none"}}
          onClick={() => this.props.updateDisplayData(this.props.currentDir+data.name+"/")}>
          <span className="glyphicon glyphicon-folder-close pull-left" style={{color:"#2895F1"}}>
          </span>

          {data.name}</button>
          <button type="button" className="btn btn-default  col-sm-2 btn-md col-md-2 btn-lg col-lg-2 " style={{border:"none"}}
          onClick={() => this.props.sharingScreen(data)}>
          <span className="glyphicon glyphicon"></span> Share
          </button>
          <button type="button" className="btn btn-default col-sm-1 btn-md col-md-1 btn-lg col-lg-1 "
           style={{border:"none",color:"#2895F1", backgroundColor:"white"}}
           onClick={() => this.setFav(data)}>
          {this.getFavIcon(data.fav)}

          </button>
          {this.getDeleteIcon(data)}
          </div>
          </li>
        );

    }
}
  render(){

    return (<div style={{padding:0}}>
      {this.getElement(this.props.data)}
    <hr style={{marginTop:1,marginBottom:1}}/>
    </div>);
  }
}

function mapStateToProps(state) {
  return {
      currentDir:state.FileReducer.currentDir,

  };
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({updateDisplayData: updateDisplayData,
      setFav: setFav,
      downloadData:downloadData,
      sharingScreen:sharingScreen,
      ondelete:onDelete,
      getgrpMembers:getgrpMembers
    }, dispatch);
}
export default connect(mapStateToProps,matchDispatchToProps)(UserDataElement);
