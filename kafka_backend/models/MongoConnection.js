var mongoose = require('mongoose');
const mongoURL = "mongodb://localhost:27017/dropbox_database";
const POOL_LIMIT = 20;
var self;
function MongoConnection() {
  self = this;
  this.connections = [];
  this.connectionStatus = [];
  this.queue = []

    this.create = function(){
      this.count = 0;
      for(var index = 0 ; index < POOL_LIMIT; index ++){
        mongoose.connect(mongoURL, {useMongoClient: true}, function(err, db){

          self.connections.push(db);
          self.connectionStatus.push(true);
        });
      }
    }

    this.getMongoConnection = function(callback) {
        for(var index = 0 ; index < this.connectionStatus.length; index ++){
          console.log("checking for connection:",index, "connections:");
          if(this.connectionStatus[index]){
            this.connectionStatus[index] = false;
            console.log("connection available :",index);
            callback(this.connections[index], index);
            return;
          }
       }
       this.queue.push(callback);
    };

    this.closeConnection = function(index) {
        if(this.queue.length > 0){
          this.queue[0](this.connections[index], index);
           this.queue.splice(0,1);
        }else{
          this.connectionStatus[index] = true;
        }
    };
}
exports = module.exports = new MongoConnection;
