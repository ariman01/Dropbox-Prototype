var mysql = require('mysql');
var ejs = require('ejs');

const USE_CONNECTION_POOL = true;
const MYSQL_POOL_SIZE = 75;
function getMySqlConnection(){
  // Need to do error handling
  var sqlconnection = mysql.createConnection({
	    host     : 'localhost',
	    user     : 'root',
	    password : 'asdf1234',
	    database : 'keepit_database',
	    port	 : 3306
	});

  return sqlconnection;
};

function getData(sqlquery, callbackFunction){
  var mysqlconnection = getMySqlConnection();
  mysqlconnection.query(sqlquery, function(err, matchedrows, fields){
    if(!err){
      console.log("gerData matchedrows", matchedrows);
      console.log("Query Result:"+JSON.stringify(matchedrows));
      callbackFunction(err, matchedrows);
    }else{
      console.log(err.message);
    }
  });
};



function getMysqlConnectionPool(){
  var connectionPool = mysql.createPool({
      connectionLimit:MYSQL_POOL_SIZE,
	    host     : 'localhost',
	    user     : 'root',
	    password : 'asdf1234',
	    database : 'keepit_database',
	    port	 : 3306
	});
  return connectionPool;
};

function executeSQLQuery(queryCmd, callbackFunction){
  if (USE_CONNECTION_POOL){
    var connectionPool = getMysqlConnectionPool();
    connectionPool.getConnection(function(err,databaseConnection){
      if(err){
        console.log("Failed to get connection !!!");
        callbackFunction(err,[]);
        //databaseConnection.release();
      }else{
        databaseConnection.query(queryCmd, function(err,result){
          //console.log("Sql Query: ",queryCmd,"\nSql result:", result);
          callbackFunction(err,result);
          databaseConnection.release();
        });
      }

    });
  }else{
    var mysqlConnection = getMySqlConnection();
    if(mysqlConnection){
      //console.log(queryCmd);
      mysqlConnection.query(queryCmd,function(err, result, fields){
        if(err){
          console.log(err.message);
          callbackFunction(err,[]);
        }else{

          callbackFunction(err,result);
        }
      });
      mysqlConnection.end();
    }
  }

};





exports.getData = getData;
exports.executeSQLQuery = executeSQLQuery;
