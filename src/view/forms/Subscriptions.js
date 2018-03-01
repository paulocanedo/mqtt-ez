import React  from 'react';
import ColorProvider  from '../../controller/ColorProvider';
import ConnectionState from '../../ConnectionState'

const mqtt_adapter = require('../../js/mqtt_adapter');
const hash = require('object-hash');

class Subscriptions extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      topic: '',
      qos: 0,
      subscriptions: {}
    };

    this.handleConfirmClick = this.handleConfirmClick.bind(this);
    this.handleTrashClick = this.handleTrashClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  canSubmit() {
    const subscriptions = this.state.subscriptions;
    const topic = this.state.topic;
    const key = hash.MD5(topic);

    return (this.props.connectionState === ConnectionState.CONNECTED) &&
           (Object.keys(subscriptions).indexOf(key) === -1) &&
           (topic.length > 0);
  }

  handleTrashClick(key, evt) {
    const subscriptions = this.state.subscriptions;
    mqtt_adapter.unsubscribe(subscriptions[key].topic, () => {
      delete subscriptions[key];
      this.setState({'subscriptions': subscriptions});
    });
  }

  handleConfirmClick(evt) {
    evt.preventDefault();

    const topic = this.state.topic;
    const qos   = this.state.qos;
    mqtt_adapter.subscribe(topic, qos, (err, granted) => {
      if(err) {
        alert(err);
        return;
      }

      let md5Topic = hash.MD5(topic);
      let color = ColorProvider.nextRandomColor();

      let sub = {
        key: md5Topic,
        color: color,
        topic: topic,
        qos: qos
      };

      let subscriptions = this.state.subscriptions;
      subscriptions[md5Topic] = sub;
      this.setState({
        'subscriptions': subscriptions,
        'topic': ''
      });
    });
  }

  handleInputChange(evt) {
    const target = evt.target;
    const value  = target.type === 'checkbox' ? target.checked : target.value;
    const name   = target.name;

    this.setState({[name]: value});
  }

  SubscriptionRow(props) {
      const id = props.sub.key;
      const color = props.sub.color;
      const topic = props.sub.topic;
      const qos = props.sub.qos;

      return (
        <tr>
          <td>
            <a style={{color: color}}>
              <i className="fas fa-square fa-lg"></i>
            </a>
          </td>
          <td>{topic}</td>
          <td className="has-text-centered">{qos}</td>
          <td className="has-text-right">
            <button className="button" onClick={this.handleTrashClick.bind(this, id)}>
              <i className="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      );
  }

  render() {
    const SubscriptionRow = this.SubscriptionRow.bind(this);
    const subKeys = Object.keys(this.state.subscriptions);
    const rows = subKeys.map(key => {
        let sub = this.state.subscriptions[key];
        return (
          <SubscriptionRow key={sub.key} sub={sub} />
        );
      }
    );

    return (
      <div className="card-content">
        <div className="tile is-ancestor is-vertical">
          <form>
            <div className="tile">
              <div className="tile is-parent is-paddingless">
                <div className="tile is-child box is-shadowless is-8">
                  <label className="label">Topic</label>
                  <input className="input" type="text" name="topic" placeholder="Topic"
                    value={this.state.topic}
                    onChange={this.handleInputChange} />
                </div>
                  <div className="tile is-child box is-shadowless is-2">
                    <label className="label">QoS</label>
                    <div className="select is-fullwidth">
                      <select name="qos"
                        value={this.state.qos}
                        onChange={this.handleInputChange} >

                        <option>0</option>
                        <option>1</option>
                        <option>2</option>
                      </select>
                  </div>
                </div>
                <div className="tile is-child box is-shadowless">
                <label className="label">&nbsp;</label>
                <button className="button is-link is-fullwidth"
                  onClick={this.handleConfirmClick}
                  disabled={!this.canSubmit()}>

                  Subscribe
                </button>
                </div>
              </div>
            </div>
          </form>

          <div className="tile">
            <div className="tile is-parent is-paddingless">
              <div className="tile is-child box is-shadowless">
                <table className="table is-hoverable is-fullwidth">
                  <thead>
                    <tr>
                      <th>Color</th>
                      <th>Topic</th>
                      <th className="has-text-centered">QoS</th>
                      <th className="has-text-right"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Subscriptions;
