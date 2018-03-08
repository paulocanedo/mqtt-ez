import React, { Component } from "react";

class Footer extends Component {
  render() {
    return (
      <footer className="footer">
        <div className="container">
          <div className="content has-text-centered">
            <p>
              <strong>MQTT-EZ</strong> by{" "}
              <a href="http://paulocanedo.com">Paulo Canedo</a>. The source code
              is licensed{" "}
              <a href="http://opensource.org/licenses/mit-license.php">MIT</a>.
            </p>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
