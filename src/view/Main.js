import React from 'react';

import SideMenu from './SideMenu';
import Card from './Card';
import ConnectionState from '../ConnectionState'
import ChangeType from '../ChangeType'

const features = require('./features');

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentFeature: features.initial,
      connectionState: ConnectionState.DISCONNECTED,
      subscriptions: {},
      messages: []
    };

    this.handleFeatureChange = this.handleFeatureChange.bind(this);
    this.handleConnectionChange = this.handleConnectionChange.bind(this);
    this.handleNewMessage = this.handleNewMessage.bind(this);
    this.handleSubscriptionChange = this.handleSubscriptionChange.bind(this);
  }

  handleNewMessage(message) {
    this.setState((prevState, props) => {
      let messages = prevState.messages;
      messages.push(message);

      return {messages: messages};
    });
  }

  handleSubscriptionChange(id, changeType, subscription) {
    const subscriptions = this.state.subscriptions;

    switch (changeType) {
      case ChangeType.INSERT:
        subscriptions[id] = subscription;
        break;
      case ChangeType.UPDATE:

        break;
      case ChangeType.DELETE:
        delete subscriptions[id];
        break;
      default:
        throw Error('unexpected change type' + changeType);
    }
    this.setState({'subscriptions': subscriptions});
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
                subscriptions={this.state.subscriptions}
                messages={this.state.messages}
                onConnectionChange={this.handleConnectionChange}
                onSubscriptionChange={this.handleSubscriptionChange}
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
