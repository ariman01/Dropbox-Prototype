var connection =  new require('./kafka/Connection');
var service_manager = require('./services/servicemanager');
var utils = require('./util/utils');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var Buffer = require('buffer');
var topic_names = ['signin_req','signup_req','getfiledirlist_req','upload_req','setFav_req','delete_req','createDir_req','sharedata_req','creategroup_req','getgrpmembers_req','addgrpmem_req','deletegrpmem_req','activityreport_req','userdata_req'];
var producer = connection.getProducer();
var userservice = require('./services/usersservice');
var dataservice = require('./services/dataservice');
var mcon = require('./models/MongoConnection');
console.log('[Kafka]server is running');
var CONNECTIONPOOL_IMP = false;
if(CONNECTIONPOOL_IMP){
mcon.create();
}else{
  var mongoURL = "mongodb://localhost:27017/dropbox_database";
  var promise = mongoose.connect(mongoURL, {
    useMongoClient: true,
    server: { poolSize: 20}
  });
}

topic_names.map((topic)=>{
  var consumer = connection.getConsumer(topic);
  //console.log(consumer);
  consumer.on('message', function (message) {
      console.log('[Kafka] message received ');
      //console.log(JSON.stringify(message.value));
      var data = JSON.parse(message.value);
      service_manager.handle_request(topic, data.data, function(error, result){
        //console.log("handle request result:", result);
        let error_msg = null;
        if(error){
          error_msg = JSON.stringify({
              msg : error
          })
        }
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify(
                  {data : result,
                  correlationId:data.correlationId,
                  error:error_msg}),

                partition : 0
            }
        ];
        console.log("Sending Response for topic :",data.replyTo)
        producer.send(payloads, function(err, data){
           console.log(data);
        });
      });

  });

});


