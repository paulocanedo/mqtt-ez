const mqtt = require("mqtt");
let client = null;

class MqttAdapter {
  clientId = null;

  constructor() {
    this.regenerateClientId();
  }

  regenerateClientId() {
    this.clientId =
      "mqtt-ez_" +
      Math.random()
        .toString(16)
        .substr(2, 8);
  }

  connect(params) {
    let url =
      params.protocol + (params.ssl === true ? "s" : "") + "://" + params.host;

    client = mqtt.connect(`${url}`, {
      wsOptions: {},
      reschedulePings: true,
      keepalive: params.keepAlive,
      clientId: params.clientId,
      port: params.port,
      // 'protocolId': params.protocol,
      // 'protocolVersion': 4,
      clean: params.cleanSession,
      reconnectPeriod: 1000, //milis
      connectTimeout: 3 * 1000,
      username: params.username,
      password: params.password
      // queueQoSZero: true,
      // incomingStore: a Store for the incoming packets
      // outgoingStore: a Store for the outgoing packets
      // will: a message that will sent by the broker automatically when the client disconnect badly. The format is:
      //     topic: the topic to publish
      //     payload: the message to publish
      //     qos: the QoS
      //     retain: the retain flag
      // transformWsUrl : optional (url, options, client) => url function For ws/wss protocols only. Can be used to implement signing urls which upon reconnect can have become expired.
      // resubscribe : if connection is broken and reconnects, subscribed topics are automatically subscribed again (default true)
    });
  }

  end() {
    //verify if is connected
    client.end();
  }

  subscribe(topic, qos, callback) {
    //verify if is connected
    client.subscribe(topic, { qos: qos }, callback);
  }

  unsubscribe(topic, callback) {
    //verify if is connected
    client.unsubscribe(topic, callback);
  }

  publish(topic, qos, retain, message, callback) {
    client.publish(
      topic,
      message,
      {
        qos: qos,
        retain: retain
      },
      callback
    );
  }

  on(evt, callback) {
    client.on(evt, callback);
  }
}

export default MqttAdapter;
