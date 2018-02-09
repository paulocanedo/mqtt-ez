// UI events -------------------------------------------------------------------
(() => {
  const menu_link_connection    = document.querySelector('#menu_link_connection');
  const menu_link_subscriptions = document.querySelector('#menu_link_subscriptions');
  const menu_link_messages      = document.querySelector('#menu_link_messages');
  const menu_link_publish       = document.querySelector('#menu_link_publish');

  const card_connection    = document.querySelector('#card_connection');
  const card_subscriptions = document.querySelector('#card_subscriptions');
  const card_messages      = document.querySelector('#card_messages');

  const connect_button = document.querySelector('#connect_button');
  const connection_indicator = document.querySelector('#connection_indicator');

  card_connection.link_card    = menu_link_connection;
  card_subscriptions.link_card = menu_link_subscriptions;
  card_messages.link_card      = menu_link_messages;

  const cards = [card_connection, card_subscriptions, card_messages];
  const menus = [menu_link_connection, menu_link_subscriptions, menu_link_messages, menu_link_publish];
  let current_card = null;

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

  // menu_link_connection.addEventListener('click', evt => setCurrentCard(card_connection));
  // menu_link_subscriptions.addEventListener('click', evt => setCurrentCard(card_subscriptions));
  // menu_link_messages.addEventListener('click', evt => setCurrentCard(card_messages));

  // var initEvents = () => {
  // };

  // window.addEventListener('load', evt => {
    // initEvents();
  // });
})();
// end UI events ---------------------------------------------------------------

const mqtt_adapter = (() => {
  return {
    connect(source) {
      var client = mqtt.connect('ws://localhost', {connectTimeout: 3 * 1000}, () => {});

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
