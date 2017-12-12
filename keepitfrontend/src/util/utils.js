const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

export const saveServerToken = (data) => {
  console.log("saveServerToken",data);
  if(data.userinfo){
    localStorage.setItem('currentUser',JSON.stringify(data.userinfo));
  }
  if(data.servertoken){
    localStorage.setItem('servertoken',data.servertoken);
  }

};

export const deleteServerToken = (server_token) => {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('servertoken');
};

export const getHTTPHeader = function(){
  var header = {
    ...headers,
    servertoken:localStorage.servertoken?localStorage.servertoken:null
  }
  return header;
};

export const getdisplayData = (currentDir, srcFilesDirs) => {
  console.log("currentDir: ",currentDir);
  console.log("get display data srcfiles:",srcFilesDirs);
  var result ={}
  for(var index in srcFilesDirs){
      var filepath = srcFilesDirs[index].path.replace(/(.*?)\//,"");
      var currdir_pattern = new RegExp('^'+currentDir);
      if(currdir_pattern.test(filepath)){
          filepath = filepath.replace(currdir_pattern,"");
          console.log("getdisplayData:",filepath.split("/"));
          filepath = filepath.split("/");
          if(filepath.length === 1){
              result[filepath] = {
              name:filepath[0],
              owner:srcFilesDirs[index].owner,
              path:srcFilesDirs[index].path,
              isFile:srcFilesDirs[index].isFile,
              isGrp:srcFilesDirs[index].isGrp,
              fav:srcFilesDirs[index].fav,
              link:null
            };
        }

      }
  }
return Object.keys(result).map(function(key) { return result[key] })
};
