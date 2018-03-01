import React  from 'react';
import ConnectionState from '../../ConnectionState'

const mqtt_adapter = require('../../js/mqtt_adapter');

class Publish extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      topic: '',
      qos: 0,
      retain: false,
      message: ''
    };

    this.handleConfirmClick = this.handleConfirmClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  canSubmit() {
    const message = this.state.message;
    const topic = this.state.topic;

    return (this.props.connectionState === ConnectionState.CONNECTED) &&
           (message.length > 0) &&
           (topic.length > 0);
  }

  handleConfirmClick(evt) {
    evt.preventDefault();

    const topic   = this.state.topic;
    const qos     = this.state.qos;
    const retain  = this.state.retain;
    const message = this.state.message;

    mqtt_adapter.publish(topic, qos, retain, message, () => {
      this.setState({
        'topic': '',
        'message': ''
      });
    });
  }

  handleInputChange(evt) {
    const target = evt.target;
    const value  = target.type === 'checkbox' ? target.checked : target.value;
    const name   = target.name;

    this.setState({[name]: value});
  }

  render() {
    return (
      <div className="card-content">
        <div className="tile is-ancestor is-vertical">
          <div className="tile">
            <div className="tile is-parent is-paddingless">
              <div className="tile is-child box is-shadowless is-8">
                <label className="label">Topic</label>
                <input className="input" type="text" name="topic" placeholder="Topic" />
              </div>
              <div className="tile is-child box is-shadowless is-1">
                <label className="label">QoS</label>
                <div className="select is-fullwidth">
                  <select name="qos">
                    <option>0</option>
                    <option>1</option>
                    <option>2</option>
                  </select>
                </div>
              </div>
              <div className="tile is-child box is-shadowless is-1">
                <label className="label">Retain</label>
                <input type="checkbox" name="retain" />
              </div>
              <div className="tile is-child box is-shadowless">
                <label className="label">&nbsp;</label>
                <button className="button is-link is-fullwidth" name="publish_button">
                  Publish
                </button>
              </div>
            </div>
          </div>
          <div className="tile">
            <div className="tile is-parent is-paddingless">
              <div className="tile is-child box is-shadowless">
                <label className="label">Message</label>
                <textarea className="textarea" name="message" placeholder="Message"></textarea>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }
}

export default Publish;
