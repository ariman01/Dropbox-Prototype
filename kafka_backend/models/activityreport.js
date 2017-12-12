var mongoose = require('mongoose');

var activityReportSchema = mongoose.Schema({
  email:{
    type:String
  },
  activity:{
    type:String
  },
  date:{
    type:String
  },
  path:{
    type:String
  }
});

const ActivityReport = mongoose.model('activityreport',activityReportSchema);


function addNewActivity(activitydetail, callback){
    console.log("addNewActivity:",activitydetail);
    activitydetail.save(callback);
}

function searchActivities(email, callback){
  console.log("searchActivities:",email);
  ActivityReport.find({email:email},callback);
}

module.exports.addNewActivity = addNewActivity;
module.exports.searchActivities = searchActivities;
module.exports.ActivityReport = ActivityReport;
