import React, { Component } from "react";

import ConnectionState from "../ConnectionState";

class SideMenuItem extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(evt) {
    this.props.onFeatureChange(this.props.feature);
  }

  render() {
    const feature = this.props.feature;
    const unreadedMessages = this.props.unreadedMessages;

    let unreadedMessagesTag = "";
    if (feature.id === 2 && unreadedMessages > 0) {
      unreadedMessagesTag = (
        <span className="tag is-rounded is-danger">
          {this.props.unreadedMessages}
        </span>
      );
    }

    let onlineTag = "";
    if (
      feature.id === 0 &&
      this.props.connectionState === ConnectionState.CONNECTED
    ) {
      onlineTag = <span className="tag is-rounded is-success">On</span>;
    }

    return (
      <a
        className={"panel-block " + (this.props.isActive ? "is-active" : "")}
        style={{ justifyContent: "space-between" }}
        onClick={this.handleClick}
      >
        <span className="panel-icon">
          <i className="fas fa-chevron-circle-right" />
        </span>
        <span style={{ flexGrow: 1 }}>{feature.description}</span>
        {onlineTag}
        {unreadedMessagesTag}
      </a>
    );
  }
}

export default SideMenuItem;
