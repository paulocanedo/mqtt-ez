import React from "react";
import ConnectionState from "../../ConnectionState";

class Publish extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topic: "",
      qos: 0,
      retain: false,
      message: ""
    };

    this.handleConfirmClick = this.handleConfirmClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  canSubmit() {
    const message = this.state.message;
    const topic = this.state.topic;

    return (
      this.props.connectionState === ConnectionState.CONNECTED &&
      message.length > 0 &&
      topic.length > 0
    );
  }

  handleConfirmClick(evt) {
    evt.preventDefault();

    const topic = this.state.topic;
    const qos = parseInt(this.state.qos, 10);
    const retain = this.state.retain === "true";
    const message = this.state.message;

    this.props.mqtt.publish(topic, qos, retain, message, () => {
      this.setState({
        topic: "",
        message: ""
      });
    });
  }

  handleInputChange(evt) {
    const target = evt.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({ [name]: value });
  }

  render() {
    return (
      <div className="card-content">
        <div className="tile is-ancestor is-vertical">
          <div className="tile">
            <div className="tile is-parent is-paddingless">
              <div className="tile is-child box is-shadowless is-6">
                <label className="label">Topic</label>
                <input
                  className="input"
                  type="text"
                  name="topic"
                  placeholder="Topic"
                  value={this.state.topic}
                  onChange={this.handleInputChange}
                />
              </div>
              <div className="tile is-child box is-shadowless is-2">
                <label className="label">QoS</label>
                <div className="select is-fullwidth">
                  <select
                    name="qos"
                    value={this.state.qos}
                    onChange={this.handleInputChange}
                  >
                    <option>0</option>
                    <option>1</option>
                    <option>2</option>
                  </select>
                </div>
              </div>
              <div className="tile is-child box is-shadowless is-2">
                <label className="label">Retain</label>
                <div className="select is-fullwidth">
                  <select
                    name="retain"
                    value={this.state.retain}
                    onChange={this.handleInputChange}
                  >
                    <option value="true">YES</option>
                    <option value="false">NO</option>
                  </select>
                </div>
              </div>
              <div className="tile is-child box is-shadowless">
                <label className="label">&nbsp;</label>
                <button
                  className="button is-link is-fullwidth"
                  onClick={this.handleConfirmClick}
                  disabled={!this.canSubmit()}
                >
                  Publish
                </button>
              </div>
            </div>
          </div>
          <div className="tile">
            <div className="tile is-parent is-paddingless">
              <div className="tile is-child box is-shadowless">
                <label className="label">Message</label>
                <textarea
                  className="textarea"
                  name="message"
                  placeholder="Message"
                  value={this.state.message}
                  onChange={this.handleInputChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Publish;
