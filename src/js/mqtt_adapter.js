const mqtt = require('mqtt');

const mqtt_adapter = (() => {
  let clientId = 'mqtt-ez_' + Math.random().toString(16).substr(2, 8);
  let client = null;

  return {
    getDefaultParams() {
      return {
        'host': 'localhost',
        'protocol': 'ws',
        'port': 80,
        'clientId': clientId,
        'keepAlive': 60,
        'ssl': false,
        'cleanSession': true
      };
    },
    connect(params) {
      let url = params.protocol + (params.ssl ? 's' : '') + '://' + params.host;

      client = mqtt.connect(`${url}`, {
        'keepalive': params.keepAlive,
        'clientId': params.clientId,
        'port': params.port,
        'protocolVersion': 4,
        'clean': params.cleanSession,
        'reconnectPeriod': 1000,//milis
        'username': params.username,
        'password': params.password
      });
    },
    subscribe(topic) {
      //verify if is connected
      client.subscribe(topic);
    },
    publish(topic, qos, retain, message, callback) {
      qos = parseInt(qos);
      client.publish(topic, message, {
        'qos': qos,
        'retain': retain
      }, callback);
    },
    on(evt, callback) {
      client.on(evt, callback);
    }
  };
})();

module.exports = mqtt_adapter;
