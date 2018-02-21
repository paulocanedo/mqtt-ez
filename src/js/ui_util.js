const observer     = require('./observer');
const mqtt_adapter = require('./mqtt_adapter');
const table_util   = require('./table_util');

const ui_util = (() => {
  const COLORS_AVAILABLE = [
    '#000000', '#40E0D0', '#FFA07A', '#800080', '#708090', '#DDA0DD', '#FF8C00', '#8FBC8F', '#0000CD',
    '#556B2F', '#00008B', '#696969', '#4B0082', '#FFE4B5', '#DAA520', '#A0522D', '#006400', '#FF4500'
  ];

  let $ = query => document.querySelector(query);

  let current_card = null;
  let messagesUnreaded = 0;

  const menu_link_connection    = $('#menu_link_connection');
  const menu_link_subscriptions = $('#menu_link_subscriptions');
  const menu_link_messages      = $('#menu_link_messages');
  const menu_link_publish       = $('#menu_link_publish');

  const card_connection    = $('#card_connection');
  const card_subscriptions = $('#card_subscriptions');
  const card_messages      = $('#card_messages');
  const card_publish       = $('#card_publish');

  const connection_indicator = $('#connection_indicator');
  const message_count_label  = $('#message_count_label');

  const connection_form = $('#connection_form');
  const connect_button = connection_form.connect_button;
  const host_field = connection_form.host;
  const protocol_field = connection_form.protocol;
  const port_field = connection_form.port;
  const clientId_field = connection_form.client_id;
  const username_field = connection_form.username;
  const password_field = connection_form.password;
  const keepAlive_field = connection_form.keep_alive;
  const ssl_field = connection_form.ssl;
  const cleanSession_field = connection_form.clean_session;

  const subscriptions_form = $('#subscriptions_form');
  const subscribe_button = subscriptions_form.subscribe_button;

  const topics_table = $('#topics_table');
  const messages_table = $('#messages_table');

  const publish_form = $('#publish_form');
  const publish_button = publish_form.publish_button;

  card_connection.link_card    = menu_link_connection;
  card_subscriptions.link_card = menu_link_subscriptions;
  card_messages.link_card      = menu_link_messages;
  card_publish.link_card       = menu_link_publish;

  const cards = [card_connection, card_subscriptions, card_messages, card_publish];
  const menus = [menu_link_connection, menu_link_subscriptions, menu_link_messages, menu_link_publish];

  window.addEventListener('DOMContentLoaded', evt => {
    // initEvents();
    var connect_action = () => {
      var source = connect_button; //this should come from event
      // source.classList.add('is-loading');
      mqtt_adapter.connect(_getConnectionParams());

      mqtt_adapter.on('connect', connack => {
        source.classList.remove('is-loading');
        connection_indicator.classList.replace('has-text-grey-light', 'has-text-success');
        // menu_link_connection.style.backgroundColor = '#23d160';
      });

      mqtt_adapter.on('error', error => {
        source.classList.remove('is-loading');
        connection_indicator.classList.replace('has-text-grey-light', 'has-text-danger');
        // menu_link_connection.style.backgroundColor = '#ff0000';
      });
    };

    var subscribe_action = () => {
      let newLine = (color, topic, qos) => {
        let cColor = table_util.createColumn(table_util.COLUMN_COLOR, {'color': color});
        let cTopic = table_util.createColumn(table_util.COLUMN_TEXT, {'text': topic});
        let cQoS = table_util.createColumn(table_util.COLUMN_TEXT, {'text': qos, 'alignment': 'has-text-centered'});
        let cControls = table_util.createColumn(table_util.COLUMN_CONTROLS);

        let line = document.createElement('tr');
        for(let column of [cColor, cTopic, cQoS, cControls])
          line.appendChild(column.root());

        return line;
      };

      let randomColor = () => {
        let value = Math.floor(Math.random() * COLORS_AVAILABLE.length);
        return COLORS_AVAILABLE[value];
      };

      let color = randomColor();
      let topic = subscriptions_form.topic.value;
      let qos = subscriptions_form.qos.value;
      let line = newLine(color, topic, qos);

      topics_table.tBodies[0].appendChild(line);

      mqtt_adapter.subscribe(topic);
      mqtt_adapter.on('message', (topic, message, packet) => {

        let newLine = (color, timestamp, topic, message, qos, retained) => {
          let cColor = table_util.createColumn(table_util.COLUMN_COLOR);
          let cTimestamp = table_util.createColumn(table_util.COLUMN_TEXT, {text: `${timestamp.toLocaleString()}`});
          let cTopic = table_util.createColumn(table_util.COLUMN_TEXT, {text: topic});
          let cMessage = table_util.createColumn(table_util.COLUMN_TEXT, {text: message});
          let cQoS = table_util.createColumn(table_util.COLUMN_TEXT, {text: `${qos}`, alignment: 'has-text-centered'});
          let cRetained = table_util.createColumn(table_util.COLUMN_TEXT, {text: retained, alignment: 'has-text-right'});

          let line = document.createElement('tr');
          for(let column of [cColor, cTimestamp, cTopic, cMessage, cQoS, cRetained])
            line.appendChild(column.root());

          return line;
        };

        let timestamp = new Date();
        let line = newLine('#0000ff', timestamp, topic, message, `${packet.qos}`, packet.retain ? 'Yes' : 'No' );
        messages_table.tBodies[0].appendChild(line);

        observer.publish('new_message', {'messagesUnreaded': ++messagesUnreaded});
      });
    };

    var publish_action = () => {
      let topic    = publish_form.topic.value,
          qos      = publish_form.qos.value,
          retain   = publish_form.retain.checked ? true : false,
          message  = publish_form.message.value,
          callback = () => {
            publish_button.classList.remove('is-loading');
            publish_form.topic.value = '';
            publish_form.message.value = '';
          };

      publish_button.classList.add('is-loading');
      mqtt_adapter.publish(topic, qos, retain, message, callback);
    };

    var removeAllCards = () => {
      for(let card of cards) {
        card.link_card.classList.remove('is-active');
        card.style.display = 'none';
      }
    };

    var setCurrentCard = (card) => {
      removeAllCards();

      current_card = card;
      card.link_card.classList.add('is-active');
      card.style.display = 'inherit';
    };

    var linkCardMenu = (menu, card) => {
      menu.addEventListener('click', evt => setCurrentCard(card));
    };
    menu_link_messages.addEventListener('click', evt => {
      observer.publish('clearMessages');
    });

    linkCardMenu(menu_link_connection, card_connection);
    linkCardMenu(menu_link_subscriptions, card_subscriptions);
    linkCardMenu(menu_link_messages, card_messages);
    linkCardMenu(menu_link_publish, card_publish);
    // setCurrentCard(card_subscriptions);
    setCurrentCard(card_connection);

    connect_button.addEventListener('click', connect_action);
    subscribe_button.addEventListener('click', subscribe_action);
    publish_button.addEventListener('click', publish_action);

    observer.subscribe('new_message', args => {
      let messagesUnreaded = args.messagesUnreaded;

      message_count_label.textContent = messagesUnreaded;
      message_count_label.classList.add('is-danger');
    });

    observer.subscribe('clearMessages', () => {
      messagesUnreaded = 0;
      message_count_label.textContent = messagesUnreaded;
      message_count_label.classList.remove('is-danger');
    });

    let $$ = query => document.querySelectorAll(query);

    //disable all forms submit
    $$('form').forEach(form => form.onsubmit = evt => false);

    let defaultParams = mqtt_adapter.getDefaultParams();
    protocol_field.value = defaultParams.protocol;
    host_field.placeholder = defaultParams.host;
    port_field.placeholder = defaultParams.port;
    clientId_field.placeholder = defaultParams.clientId;
    keepAlive_field.placeholder = defaultParams.keepAlive;
    ssl_field.checked = defaultParams.ssl;
    cleanSession_field.checked = defaultParams.cleanSession;
  });

  let _getConnectionParams = () => {
    let defaultParams = mqtt_adapter.getDefaultParams();
    let host = host_field.value || defaultParams.host,
        protocol = protocol_field.value || defaultParams.protocol,
        port = parseInt(port_field.value) || defaultParams.port,
        clientId = clientId_field.value || defaultParams.clientId,
        username = username_field.value,
        password = password_field.value,
        keepAlive = parseInt(keepAlive_field.value) || defaultParams.keepAlive,
        ssl = ssl_field.checked,
        cleanSession = cleanSession_field.checked;

    return {
      'host': host,
      'protocol': protocol,
      'port': port,
      'clientId': clientId,
      'username': username,
      'password': password,
      'keepAlive': keepAlive,
      'ssl': ssl,
      'cleanSession': cleanSession
    };
  };

  return {
    getConnectionParams() {
      return _getConnectionParams();
    }
  };
})();

module.exports = ui_util;
