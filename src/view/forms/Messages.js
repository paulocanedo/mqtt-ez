import React  from 'react';

const hash = require('object-hash');

class Messages extends React.Component {

  MessageRow(props) {
    // const id = props.sub.key;
    const color = props.message.color;
    const timestamp = props.message.timestamp.toLocaleTimeString();
    const topic = props.message.topic;
    const message = props.message.content;
    const qos = props.message.qos;
    const retained = props.message.retain ? 'YES' : 'NO';

    return (
      <tr style={{borderLeft: 'solid ' + color + ' 5px'}}>
        <td>{timestamp}</td>
        <td>{topic}</td>
        <td>{message}</td>
        <td className="has-text-centered">{qos}</td>
        <td className="has-text-right">{retained}</td>
      </tr>
    );
  }

  render() {
    const MessageRow = this.MessageRow.bind(this);
    const messages = this.props.messages;

    const rows = messages.map(elem => {
      let key = hash.MD5('' + elem.timestamp.getTime + elem.content);
      return (
        <MessageRow key={key} message={elem} />
      );
    });

    return (
      <div className="card-content">
        <table className="table is-hoverable is-fullwidth">
          <thead>
            <tr>
              <th>timestamp</th>
              <th>Topic</th>
              <th>Message</th>
              <th className="has-text-centered">QoS</th>
              <th className="has-text-right">Retained</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Messages;
