import React from "react";

import SideMenu from "./SideMenu";
import Card from "./Card";
import ConnectionState from "../ConnectionState";
import ChangeType from "../ChangeType";

const features = require("./features");

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentFeature: features.initial,
      connectionState: ConnectionState.DISCONNECTED,
      unreadedMessages: 0,
      subscriptions: {},
      messages: []
    };

    this.handleFeatureChange = this.handleFeatureChange.bind(this);
    this.handleConnectionChange = this.handleConnectionChange.bind(this);
    this.handleNewMessage = this.handleNewMessage.bind(this);
    this.handleSubscriptionChange = this.handleSubscriptionChange.bind(this);
    this.clearMessages = this.clearMessages.bind(this);
  }

  clearMessages() {
    this.setState({
      messages: [],
      unreadedMessages: 0
    });
  }

  handleNewMessage(message) {
    //for some reason, message retained is fire before subscribe callback
    setTimeout(() => {
      const messages = this.state.messages;
      const subscriptions = this.state.subscriptions;

      for (let sub of Object.values(subscriptions)) {
        if (sub.topic === message.topic) {
          message.color = sub.color;
        }
      }

      messages.push(message);
      message.isNew = true;

      this.setState(prevState => {
        return {
          unreadedMessages: prevState.unreadedMessages + 1,
          messages: messages
        };
      });
    }, 100);
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
        throw Error("unexpected change type" + changeType);
    }
    this.setState({ subscriptions: subscriptions });
  }

  handleConnectionChange(newConnectionState) {
    if (newConnectionState === ConnectionState.DISCONNECTED) {
      this.setState({ subscriptions: {}, messages: [], unreadedMessages: 0 });
    }
    this.setState({ connectionState: newConnectionState });
  }

  handleFeatureChange(newFeature) {
    this.setState({ currentFeature: newFeature });
  }

  render() {
    return (
      <div className="hero">
        <div className="container">
          <div className="columns">
            <div className="column is-one-quarter">
              <SideMenu
                currentFeature={this.state.currentFeature}
                features={features}
                connectionState={this.state.connectionState}
                unreadedMessages={this.state.unreadedMessages}
                onFeatureChange={this.handleFeatureChange}
              />
            </div>
            <div className="column">
              <Card
                mqtt={this.props.mqtt}
                currentFeature={this.state.currentFeature}
                connectionState={this.state.connectionState}
                subscriptions={this.state.subscriptions}
                messages={this.state.messages}
                onConnectionChange={this.handleConnectionChange}
                onSubscriptionChange={this.handleSubscriptionChange}
                onNewMessage={this.handleNewMessage}
                onFeatureChange={this.handleFeatureChange}
                clearMessages={this.clearMessages}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Main;
