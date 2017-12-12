var rpc = new (require('./kafkarpc'))();

//make request to kafka
function make_request(queue_name, payload, callback){
    console.log('in make request');
    console.log(payload);
	rpc.makeRequest(queue_name, payload, function(err, response){

		if(err){
			console.error(err);
    }
			//console.log("error: ",err,"response: ", response);
			callback(err, response);

	});
}

exports.make_request = make_request;
