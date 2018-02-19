let table_util = (() => {
  let createColumnColor = (args = {}) => {
    let column = document.createElement('td');
    let color_link = document.createElement('a');
    let color = document.createElement('i');

    color_link.title = "Choose a color";
    color.classList.add('fas', 'fa-square', 'fa-lg');

    color_link.appendChild(color);
    column.appendChild(color_link);

    return {
      setColor(color) {
      },
      root() {
        return column;
      }
    };
  };
  let createColumnText = (args = {}) => {
    let column = document.createElement('td');
    let textNode = document.createTextNode(args.text || '');
    column.className = args.alignment || '';
    column.appendChild(textNode);

    return {
      setText(text) {
        textNode.textContent = text;
      },
      setAlignment(alignment) {
        column.className = alignment;
      },
      root() {
        return column;
      }
    };
  };

  let createColumnControls = (args = {}) => {
    let column = document.createElement('td');
    column.className = 'has-text-right';

    let createButton = () => {
      let a = document.createElement('a');
      a.href = '#';
      a.className = 'button';

      return a;
    };
    let createIcon = (icon_code) => {
      let icon = document.createElement('i');
      icon.classList.add('fas', icon_code);

      return icon;
    };
    let wrapIcon = (icon) => {
      let wrapper = document.createElement('span');
      wrapper.className = 'icon';
      wrapper.appendChild(icon);
      return wrapper;
    };

    let editButton = createButton();
    let editIcon = createIcon('fa-edit');

    let deleteButton = createButton();
    let deleteIcon = createIcon('fa-trash');

    editButton.appendChild(wrapIcon(editIcon));
    deleteButton.appendChild(wrapIcon(deleteIcon));

    column.appendChild(editButton);
    column.appendChild(document.createTextNode(' '));
    column.appendChild(deleteButton);

    return {
      setAlignment(alignment) {
        column.className = alignment;
      },
      root() {
        return column;
      }
    };
  };
  return {
    COLUMN_COLOR: 0,
    COLUMN_TEXT: 1,
    COLUMN_CONTROLS: 2,
    createColumn(type, args) {
      switch (type) {
        case table_util.COLUMN_COLOR:
          return createColumnColor(args);
          break;
        case table_util.COLUMN_TEXT:
          return createColumnText(args);
          break;
        case table_util.COLUMN_CONTROLS:
          return createColumnControls(args);
          break;
        default:

      }
    }
  };
})();

var ui_utils = (() => {
  let $ = query => document.querySelector(query);

  const menu_link_connection    = $('#menu_link_connection');
  const menu_link_subscriptions = $('#menu_link_subscriptions');
  const menu_link_messages      = $('#menu_link_messages');
  const menu_link_publish       = $('#menu_link_publish');

  const card_connection    = $('#card_connection');
  const card_subscriptions = $('#card_subscriptions');
  const card_messages      = $('#card_messages');
  const card_publish       = $('#card_publish');

  const connection_indicator = $('#connection_indicator');

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
  let current_card = null;

  window.addEventListener('DOMContentLoaded', evt => {
    // initEvents();
    var connect_action = () => {
      var source = connect_button; //this should come from event
      // source.classList.add('is-loading');
      mqtt_adapter.connect(_getConnectionParams());

      mqtt_adapter.on('connect', connack => {
        source.classList.remove('is-loading');
        connection_indicator.classList.replace('has-text-grey-light', 'has-text-success');
        menu_link_connection.style.backgroundColor = '#23d160';
      });

      mqtt_adapter.on('error', error => {
        source.classList.remove('is-loading');
        connection_indicator.classList.replace('has-text-grey-light', 'has-text-danger');
        menu_link_connection.style.backgroundColor = '#ff0000';
      });
    };

    var subscribe_action = () => {
      let newLine = (color, topic, qos) => {
        let cColor = table_util.createColumn(table_util.COLUMN_COLOR);
        let cTopic = table_util.createColumn(table_util.COLUMN_TEXT, {text: topic});
        let cQoS = table_util.createColumn(table_util.COLUMN_TEXT, {text: qos, alignment: 'has-text-centered'});
        let cControls = table_util.createColumn(table_util.COLUMN_CONTROLS);

        let line = document.createElement('tr');
        for(let column of [cColor, cTopic, cQoS, cControls])
          line.appendChild(column.root());

        return line;
      };

      let randomColor = () => {
        return '#0000ff';
      };

      let color = randomColor();
      let topic = subscriptions_form.topic.value;
      let qos = subscriptions_form.qos.value;
      let line = newLine(color, topic, qos);

      topics_table.tBodies[0].appendChild(line);

      mqtt_adapter.subscribe(topic);
      mqtt_adapter.on('message', (topic, message, packet) => {
        console.log(topic, message);
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
      });
    };

    var publish_action = () => {
      let topic   = publish_form.topic.value,
          qos     = publish_form.qos.value,
          retain  = publish_form.retain.checked ? true : false,
          message = 'teste';

      mqtt_adapter.publish(topic, qos, retain, message);
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

    linkCardMenu(menu_link_connection, card_connection);
    linkCardMenu(menu_link_subscriptions, card_subscriptions);
    linkCardMenu(menu_link_messages, card_messages);
    linkCardMenu(menu_link_publish, card_publish);
    // setCurrentCard(card_subscriptions);
    setCurrentCard(card_connection);

    connect_button.addEventListener('click', connect_action);
    subscribe_button.addEventListener('click', subscribe_action);
    publish_button.addEventListener('click', publish_action);

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
      console.log(_getConnectionParams());
      return _getConnectionParams();
    }
  };
})();
// end UI events ---------------------------------------------------------------

const mqtt_adapter = (() => {
  let clientId = 'mqtt-ez_' + Math.random().toString(16).substr(2, 8);
  let client = null;

  return {
    getDefaultParams() {
      return {
        'host': 'localhost',
        'protocol': 'ws',
        'port': 80,
        'clientId': clientId,
        'keepAlive': 60,
        'ssl': false,
        'cleanSession': true
      };
    },
    connect(params) {
      let url = params.protocol + (params.ssl ? 's' : '') + '://' + params.host;
      console.log(url);

      client = mqtt.connect(`${url}`, {
        'keepalive': params.keepAlive,
        'clientId': params.clientId,
        'protocolVersion': 4,
        'clean': params.cleanSession,
        'reconnectPeriod': 1000,//milis
        'username': params.username,
        'password': params.password
      });
    },
    subscribe(topic) {
      client.subscribe(topic);
    },
    publish(topic, qos, retain, message) {
      qos = parseInt(qos);
      client.publish(topic, message, {
        'qos': qos,
        'retain': retain
      },
      () => {
        console.log("published");
      });
    },
    on(evt, callback) {
      client.on(evt, callback);
    }
  };
})();
