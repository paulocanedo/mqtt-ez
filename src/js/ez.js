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

  const connect_button = $('#connect_button');
  const connection_indicator = $('#connection_indicator');

  const connection_form = $('#connection_form');
  const host_field = connection_form.host;
  const protocol_field = connection_form.protocol;
  const port_field = connection_form.port;
  const clientId_field = connection_form.client_id;
  const username_field = connection_form.username;
  const password_field = connection_form.password;
  const keepAlive_field = connection_form.keep_alive;
  const ssl_field = connection_form.ssl;
  const cleanSession_field = connection_form.clean_session;

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
      source.classList.add('is-loading');
      mqtt_adapter.connect(source);
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
    }

    var linkCardMenu = (menu, card) => {
      menu.addEventListener('click', evt => setCurrentCard(card));
    };

    linkCardMenu(menu_link_connection, card_connection);
    linkCardMenu(menu_link_subscriptions, card_subscriptions);
    linkCardMenu(menu_link_messages, card_messages);
    setCurrentCard(card_connection);

    connect_button.addEventListener('click', connect_action);
  });

  return {
    getConnectionParams() {
      let host = "localhost", protocol = "mqtt", port = 1883, clientId = "",
          username = "", password = "", keepAlive = 60,
          ssl = false, cleanSession = true;

      host = host_field.value;
      protocol = protocol_field.value;
      port = parseInt(port_field.value);
      clientId = clientId_field.value;
      username = username_field.value;
      password = password_field.value;
      keepAlive = parseInt(keepAlive_field.value);
      ssl = ssl_field.value;
      cleanSession = cleanSession_field.value;

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
      }
    }
  };
})();
// end UI events ---------------------------------------------------------------

const mqtt_adapter = (() => {
  return {
    connect(source) {
      let params = ui_utils.getConnectionParams();

      var client = mqtt.connect(`${params.protocol}://${params.host}`, {connectTimeout: 3 * 1000}, () => {});

      client.on('connect', connack => {
        source.classList.remove('is-loading');
        connection_indicator.classList.replace('has-text-grey-light', 'has-text-success');
      });

      client.on('error', error => {
        source.classList.remove('is-loading');
        connection_indicator.classList.replace('has-text-grey-light', 'has-text-danger');
      });
    }
  };
})();

// const mqtt = require('mqtt');

// var client = mqtt.connect('wss://iot.eclipse.org');
// var client = mqtt.connect('ws://localhost');
//
// client.on('connect', function() {
//   console.log('connected');
// });
