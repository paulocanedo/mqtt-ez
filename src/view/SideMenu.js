import React, { Component } from 'react';

import SideMenuItem from './SideMenuItem'

class SideMenu extends Component {

  constructor(props) {
    super(props);

    this.onFeatureChange = this.onFeatureChange.bind(this);
  }

  onFeatureChange(newFeature) {
    this.props.onFeatureChange(newFeature);
  }

  render() {
    const features = this.props.features.list;
    const currentFeature = this.props.currentFeature;

    const menuItems = Object.entries(features).map(([feature_id, feature]) =>
    <SideMenuItem text={feature.title}
       key={feature_id}
       feature={feature}
       onFeatureChange={this.onFeatureChange}
       isActive={feature.id === currentFeature.id} />
    );

    return (
      <nav className="panel">
        <p className="panel-heading">MQTT-EZ</p>
        { menuItems }
      </nav>
    );
  }
}

export default SideMenu;
