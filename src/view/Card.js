import React from "react";

import Connection from "./forms/Connection";
import Subscriptions from "./forms/Subscriptions";
import Messages from "./forms/Messages";
import Publish from "./forms/Publish";

// const features = require('./features');

class Card extends React.Component {
  render() {
    const currentFeature = this.props.currentFeature;
    const currentForm = FormBuilder.build(currentFeature.id, this.props);

    return (
      <div className="card">
        <header className="card-header">
          <p className="card-header-title">{currentFeature.title}</p>
        </header>

        {currentForm}
      </div>
    );
  }
}

class FormBuilder {
  static build(feature_id, props) {
    switch (feature_id) {
      case 0: {
        return (
          <Connection
            connectionState={props.connectionState}
            onNewMessage={props.onNewMessage}
            onConnectionChange={props.onConnectionChange}
            mqtt={props.mqtt}
          />
        );
      }
      case 1: {
        return (
          <Subscriptions
            connectionState={props.connectionState}
            subscriptions={props.subscriptions}
            onSubscriptionChange={props.onSubscriptionChange}
            mqtt={props.mqtt}
          />
        );
      }
      case 2: {
        return (
          <Messages
            connectionState={props.connectionState}
            messages={props.messages}
            clearMessages={props.clearMessages}
            mqtt={props.mqtt}
          />
        );
      }
      case 3: {
        return (
          <Publish connectionState={props.connectionState} mqtt={props.mqtt} />
        );
      }
      default: {
        throw Error("unexpected feature id");
      }
    }
  }
}

export default Card;
