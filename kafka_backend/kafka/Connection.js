var kafka = require('kafka-node');

function ConnectionProvider() {
    this.consumers = {};
    this.getConsumer = function(topic_name) {


            if(!this.consumers[topic_name]){
              let client = new kafka.Client("localhost:2181");
              let kafkaConsumerConnection = new kafka.Consumer(client,[ { topic: topic_name, partition: 0 }]);
              this.consumers[topic_name] = kafkaConsumerConnection;
              client.on('ready', function () {
                 console.log('new client consumer ready! topic name:',topic_name);
              });
            }
            //console.log("this.consumers",this.consumers);

        return this.consumers[topic_name];
    };

    //Code will be executed when we start Producer
    this.getProducer = function() {

        if (!this.kafkaProducerConnection) {
            this.client = new kafka.Client("localhost:2181");
            var HighLevelProducer = kafka.HighLevelProducer;
            this.kafkaProducerConnection = new HighLevelProducer(this.client);
            console.log('producer created kafka server!!!');
        }
        return this.kafkaProducerConnection;
    };
}
exports = module.exports = new ConnectionProvider;
