// UI events -------------------------------------------------------------------
var ui_utils = (() => {
  let $ = query => document.querySelector(query);

  const menu_link_connection    = $('#menu_link_connection');
  const menu_link_subscriptions = $('#menu_link_subscriptions');
  const menu_link_messages      = $('#menu_link_messages');
  const menu_link_publish       = $('#menu_link_publish');

  const card_connection    = $('#card_connection');
  const card_subscriptions = $('#card_subscriptions');
  const card_messages      = $('#card_messages');

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

  card_connection.link_card    = menu_link_connection;
  card_subscriptions.link_card = menu_link_subscriptions;
  card_messages.link_card      = menu_link_messages;

  const cards = [card_connection, card_subscriptions, card_messages];
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
      });

      mqtt_adapter.on('error', error => {
        source.classList.remove('is-loading');
        connection_indicator.classList.replace('has-text-grey-light', 'has-text-danger');
      });
    };

    var subscribe_action = () => {
      let topic = subscriptions_form.topic.value;

      mqtt_adapter.subscribe(topic);
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
    setCurrentCard(card_connection);

    connect_button.addEventListener('click', connect_action);
    subscribe_button.addEventListener('click', subscribe_action);

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
        'port': 1883,
        'clientId': clientId,
        'keepAlive': 60,
        'ssl': false,
        'cleanSession': true
      };
    },
    connect(params) {
      let url = params.protocol + (params.ssl ? 's' : '') + '://' + params.host;

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
    on(evt, callback) {
      client.on(evt, callback);
    }
  };
})();
