const mqtt = require('mqtt');
// var client = mqtt.connect('wss://iot.eclipse.org');
var client = mqtt.connect('mqtt:localhost');

client.on('connect', function() {
  console.log('connected');

  client.subscribe('paulocanedo/#');
  client.on('message', function(topic, message) {
    console.log(message);
  });
});
