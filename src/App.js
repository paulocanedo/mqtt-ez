import React from "react";

import Main from "./view/Main";
import Footer from "./view/Footer";

import MqttAdapter from "./controller/MqttAdapter";

class App extends React.Component {
  mqtt = new MqttAdapter();

  render() {
    return (
      <div>
        <Main mqtt={this.mqtt} />
        <Footer />
      </div>
    );
  }
}

export default App;
