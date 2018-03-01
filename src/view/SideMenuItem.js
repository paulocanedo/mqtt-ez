import React, { Component } from 'react';

class SideMenuItem extends Component {

  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(evt) {
    this.props.onFeatureChange(this.props.feature);
  }

  render() {
    return (
      <a className={"panel-block " + (this.props.isActive ? 'is-active' : '')}
        onClick={this.handleClick}>

        <span className="panel-icon">
          <i className="fas fa-chevron-circle-right"></i>
        </span>
        {this.props.text}
        {/*<span className="icon has-text-grey-light" id="connection_indicator">
          <i className="fas fa-circle"></i>
        </span>*/}
      </a>
    );
  }
}

export default SideMenuItem;
