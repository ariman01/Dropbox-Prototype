var mongoose = require('mongoose');

var fileDirSchema = mongoose.Schema({
  path:{
    type:String
  },
  owner:{
    type:Boolean, default:true
  },
  isFile:{
    type:Boolean, default:true
  },
  isGrp:{
    type:Boolean, default:false
  },
  email:{
    type:String
  },
  isFav:{
    type:Boolean, default:false
  }
});

const FileDir = mongoose.model('filedir',fileDirSchema);


function addNewFileDir(filedirdetail, callback){
    console.log("add new file/dir/grp:",filedirdetail);
    filedirdetail.save(callback);
}
function addMultipleFilesDir(dataArray, callback){
  FileDir.create(dataArray, callback);
}

function searchFileDir(email, callback){
	var query = {email:email};
	FileDir.find(query, callback);
}

function searchGrpMem(path, callback){
	var query = {path:path};
	FileDir.find(query, callback);
}

function setFav(email, path, status, callback){
	var query = {email: email, path:path};
	FileDir.update(query, { $set: { isFav: status }}, callback);
}

function deleteFileDir(condition, callback){
  FileDir.deleteOne(condition, callback);
}
function deleteAll(condition, callback){
  FileDir.remove(condition,callback);
}
function getAllFilesDirs(callback){
  FileDir.find({},callback);
}


module.exports.addNewFileDir = addNewFileDir;
module.exports.searchFileDir = searchFileDir;
module.exports.addMultipleFilesDir = addMultipleFilesDir;
module.exports.searchGrpMem = searchGrpMem;
module.exports.deleteFileDir = deleteFileDir;
module.exports.getAllFilesDirs = getAllFilesDirs;
module.exports.deleteAll = deleteAll;
module.exports.setFav = setFav;
module.exports.FileDir = FileDir;
