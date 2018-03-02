import React, { Component } from 'react';

import ConnectionState from '../../ConnectionState'

const mqtt_adapter = require('../../js/mqtt_adapter');

class Connection extends Component {

  constructor(props) {
    super(props);
    this.state = {
      clientId: 'mqtt-ez_' + Math.random().toString(16).substr(2, 8),
      host: 'localhost',
      protocol: 'ws',
      port: 80,
      keepAlive: 60,
      ssl: false,
      cleanSession: true
    };

    this.handleConnectionClick = this.handleConnectionClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  doConnect() {
    this.props.onConnectionChange(ConnectionState.CONNECTING);

    mqtt_adapter.connect({
      keepalive: this.state.keepAlive,
      clientId: this.state.clientId,
      host: this.state.host,
      protocol: this.state.protocol,
      port: this.state.port,
      // 'protocolVersion': 4,
      ssl: this.state.ssl,
      clean: this.state.cleanSession,
      // 'connectTimeout': 10 * 1000,
      // 'reconnectPeriod': 1000, //milis
      username: this.state.username,
      password: this.state.password
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

    mqtt_adapter.on('connect', connack => {
      this.props.onConnectionChange(ConnectionState.CONNECTED);
    });

    mqtt_adapter.on('message', (topic, content, packet) => {
      const message = {
        topic: topic,
        timestamp: new Date(),
        content: content.toString(),
        qos: packet.qos,
        retain: packet.retain
      };
      this.props.onNewMessage(message);
    })
  }

  doDisconnect() {
    mqtt_adapter.end();
    mqtt_adapter.on('close', connack => {
      this.props.onConnectionChange(ConnectionState.DISCONNECTED);
    });
  }

  handleConnectionClick(evt) {
    evt.preventDefault();
    switch (this.props.connectionState) {
      case ConnectionState.CONNECTED: {
        this.doDisconnect();
        break;
      }
      case ConnectionState.CONNECTING: {
        //do nothing
        break;
      }
      case ConnectionState.DISCONNECTED: {
        this.doConnect();
        break;
      }
      default: {
        throw Error('unexpected connection state');
      }
    }
  }

  handleInputChange(evt) {
    const target = evt.target;
    const value  = target.type === 'checkbox' ? target.checked : target.value;
    const name   = target.name;

    this.setState({[name]: value});
  }

  render() {
    let isConnected = this.props.connectionState === ConnectionState.CONNECTED;
    let isConnecting = this.props.connectionState === ConnectionState.CONNECTING;

    let extraClassesNames = '';
    if(isConnected) {
      extraClassesNames = 'is-danger';
    } else if(isConnecting) {
      extraClassesNames = 'is-loading';
    }

    return (
      <div className="card-content">
        <div className="tile is-ancestor is-vertical">
          <form>
          <div className="tile">
            <div className="tile is-parent is-paddingless">
              <div className="tile is-child box is-shadowless is-5">
                <label className="label">Host</label>
                <input className="input" type="text" name="host"
                  value={this.state.host}
                  onChange={this.handleInputChange} />
              </div>
              <div className="tile is-child box is-shadowless is-3">
                <label className="label">Protocol</label>
                <div className="select is-fullwidth">
                  <select name="protocol" value={this.state.protocol}
                    onChange={this.handleInputChange}>
                    <option value="mqtt">MQTT</option>
                    <option value="ws">Web Socket</option>
                  </select>
                </div>
              </div>
              <div className="tile is-child box is-shadowless is-1">
                <label className="label">Port</label>
                <input className="input" type="text" name="port"
                  value={this.state.port}
                  onChange={this.handleInputChange} />
              </div>
              <div className="tile is-child box is-shadowless">
                <label className="label">Client ID</label>
                <input className="input" type="text"
                  value={this.state.clientId}
                  onChange={this.handleInputChange} />
              </div>
            </div>
          </div>

          <div className="tile">
            <div className="tile is-parent is-paddingless">
              <div className="tile is-child box is-shadowless is-2">
                <label className="label">Username</label>
                <input className="input" type="text" name="username"
                  value={this.state.username}
                  onChange={this.handleInputChange} />
              </div>
              <div className="tile is-child box is-shadowless is-2">
                <label className="label">Password</label>
                <input className="input" type="password" name="password"
                  value={this.state.password}
                  onChange={this.handleInputChange} />
              </div>
              <div className="tile is-child box is-shadowless is-2">
                <label className="label">Keep Alive</label>
                <input className="input" type="text" name="keepAlive"
                  value={this.state.keepAlive}
                  onChange={this.handleInputChange} />
              </div>
              <div className="tile is-child box is-shadowless is-2">
                <label className="label">
                  SSL
                </label>
                <div className="select is-fullwidth">
                  <select name="ssl" value={this.state.ssl} onChange={this.handleInputChange}>
                    <option value="true">YES</option>
                    <option value="false">NO</option>
                  </select>
                </div>
              </div>
              <div className="tile is-child box is-shadowless is-2">
                <label className="label">
                  Clean Session
                </label>
                <div className="select is-fullwidth">
                  <select name="cleanSession" value={this.state.cleanSession} onChange={this.handleInputChange}>
                    <option value="true">YES</option>
                    <option value="false">NO</option>
                  </select>
                </div>
              </div>
              <div className="tile is-child box is-shadowless is-2">
                <label className="label">
                  &nbsp;
                </label>
                <button className={"button is-fullwidth is-link " + extraClassesNames}
                  onClick={this.handleConnectionClick}>
                  {!isConnected ? 'Connect' : 'Disconnect'}
                </button>
              </div>
            </div>
          </div>

        </form>
        </div>
      </div>
    );
  }
}

export default Connection;
