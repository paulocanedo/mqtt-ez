import React from 'react';

import SideMenu from './SideMenu';
import Card from './Card';
import ConnectionState from '../ConnectionState'

const features = require('./features');

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentFeature: features.initial,
      connectionState: ConnectionState.DISCONNECTED,
      messages: []
    };

    this.handleFeatureChange = this.handleFeatureChange.bind(this);
    this.handleConnectionChange = this.handleConnectionChange.bind(this);
    this.handleNewMessage = this.handleNewMessage.bind(this);
  }

  handleNewMessage(message) {
    this.setState((prevState, props) => {
      let messages = prevState.messages;
      messages.push(message);

      return {messages: messages};
    });
  }

  handleConnectionChange(newConnectionState) {
    this.setState({connectionState: newConnectionState});
  }

  handleFeatureChange(newFeature) {
    this.setState({currentFeature: newFeature});
  }

  render() {
    return (
      <div className="hero">
        <div className="container">
          <div className="columns">
            <div className="column is-one-quarter">
              <SideMenu currentFeature={this.state.currentFeature}
                features={features}
                onFeatureChange={this.handleFeatureChange} />
            </div>
            <div className="column">
              <Card currentFeature={this.state.currentFeature}
                connectionState={this.state.connectionState}
                messages={this.state.messages}
                onConnectionChange={this.handleConnectionChange}
                onNewMessage={this.handleNewMessage}
                onFeatureChange={this.handleFeatureChange} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Main;
